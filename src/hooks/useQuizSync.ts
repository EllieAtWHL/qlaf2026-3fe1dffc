import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuizStore } from '@/store/quizStore';
import questionsData from '@/data/questions.json';
import { getRoundIdByIndex } from '@/utils/roundUtils';
import type { RealtimeChannel } from '@supabase/supabase-js';

const CHANNEL_NAME = 'quiz-sync';

export const useQuizSync = (_isHost: boolean = false, _disabled: boolean = false) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const store = useQuizStore();

  useEffect(() => {
    console.log('[QuizSync] useEffect running - _disabled:', _disabled);
    
    // Don't create channel if disabled
    if (_disabled) {
      console.log('[QuizSync] Sync disabled, skipping channel creation');
      return;
    }
    
    console.log('[QuizSync] Creating new channel...');
    
    // Create a broadcast channel for real-time sync
    const channel = supabase.channel(CHANNEL_NAME, {
      config: {
        broadcast: { self: false }, // Don't receive own broadcasts
      },
    });

    channelRef.current = channel;

    // Listen for state updates from co-host
    channel
      .on('broadcast', { event: 'state-update' }, ({ payload }) => {
        console.log('[QuizSync] Received state update:', payload);
        
        // Apply the state update - only require action, data is optional
        if (payload?.action) {
          applyStateUpdate(payload.action, payload.data);
        }
      })
      .subscribe((status) => {
        console.log('[QuizSync] Channel status:', status);
      });

    return () => {
      console.log('[QuizSync] CLEANUP FUNCTION CALLED - This will close the channel!');
      console.log('[QuizSync] Channel ref before cleanup:', !!channelRef.current);
      if (channelRef.current) {
        channel.unsubscribe();
        console.log('[QuizSync] Channel unsubscribed');
      }
    };
  }, []); // Empty dependency array - effect only runs once per component mount

  // Function to broadcast state changes (used by co-host)
  const broadcastAction = (action: string, data?: any) => {
    if (!channelRef.current || _disabled) {
      console.warn('[QuizSync] Channel not ready or disabled');
      return;
    }

    console.log('[QuizSync] Broadcasting:', action, data);
    channelRef.current.send({
      type: 'broadcast',
      event: 'state-update',
      payload: { action, data },
    });
  };

  return { broadcastAction };
};

// Helper function to load questions for current round
function loadQuestionsForCurrentRound() {
  const store = useQuizStore.getState();
  const currentRoundId = getRoundIdByIndex(store.currentRoundIndex);
  
  const data = questionsData as any;
  const currentRoundData = data[currentRoundId];
  const questions = currentRoundData?.questions || [];
  
  useQuizStore.setState({ questions });
}

// Apply state updates received from broadcast - uses store directly
function applyStateUpdate(action: string, data: any) {
  const store = useQuizStore.getState();
  console.log('[QuizSync] Applying action:', action, 'Current state:', store.gameState);
  
  switch (action) {
    case 'startGame':
      useQuizStore.setState({ gameState: 'round-transition', currentRoundIndex: 0 });
      loadQuestionsForCurrentRound();
      break;
    case 'startRound':
      useQuizStore.setState({ gameState: 'round', isTransitioning: false });
      loadQuestionsForCurrentRound();
      
      // Also initialize picture boards if this is picture board round
      const currentRoundId = getRoundIdByIndex(useQuizStore.getState().currentRoundIndex);
      console.log('[QuizSync] Starting round:', currentRoundId);
      if (currentRoundId === 'picture-board') {
        console.log('[QuizSync] Initializing picture boards in sync...');
        const data = questionsData as any;
        const pictureBoardData = data['picture-board'];
        const boards = pictureBoardData?.boards || [];
        console.log('[QuizSync] Picture boards found:', boards.length);
        useQuizStore.setState({ 
          pictureBoards: boards,
          availableBoards: ['board-1', 'board-2', 'board-3'],
          selectedBoards: {},
          currentTeamSelecting: 1,
          currentBoard: null
        });
      }
      break;
    case 'nextRound':
      if (store.currentRoundIndex < 10) {
        useQuizStore.setState({ 
          currentRoundIndex: store.currentRoundIndex + 1, 
          gameState: 'round-transition',
          currentQuestionIndex: 0,
          showAnswer: false,
          questions: [], // Clear questions during transition
          isTransitioning: true, // Explicitly mark as transitioning
        });
        
        // Load questions after a brief delay to ensure transition state is set first
        setTimeout(() => {
          loadQuestionsForCurrentRound();
          useQuizStore.setState({ isTransitioning: false }); // End transition after questions are loaded
        }, 100);
      }
      break;
    case 'previousRound':
      if (store.currentRoundIndex > 0) {
        useQuizStore.setState({ 
          currentRoundIndex: store.currentRoundIndex - 1,
          gameState: 'round-transition',
          currentQuestionIndex: 0,
          showAnswer: false,
          questions: [], // Clear questions during transition
        });
      }
      break;
    case 'goToRound':
      useQuizStore.setState({ 
        currentRoundIndex: data.index,
        gameState: 'round-transition',
        currentQuestionIndex: 0,
        showAnswer: false,
        questions: [], // Clear questions during transition
      });
      break;
    case 'showScores':
      useQuizStore.setState({ gameState: 'scores' });
      break;
    case 'showTransition':
      useQuizStore.setState({ gameState: 'round-transition' });
      break;
    case 'showFinal':
      useQuizStore.setState({ gameState: 'final' });
      break;
    case 'startTimer':
      useQuizStore.setState({ isTimerRunning: true });
      break;
    case 'pauseTimer':
      useQuizStore.setState({ isTimerRunning: false });
      break;
    case 'resetTimer':
      useQuizStore.setState({ 
        timerValue: data?.duration ?? 60, 
        isTimerRunning: false 
      });
      break;
    case 'tick':
      store.tick();
      break;
    case 'updateTeamScore':
      const teamsForUpdate = [...store.teams];
      const teamToUpdate = teamsForUpdate.find(t => t.id === data.teamId);
      if (teamToUpdate) {
        teamToUpdate.scores[data.roundIndex] = data.score;
        teamToUpdate.totalScore = teamToUpdate.scores.reduce((a, b) => a + b, 0);
        useQuizStore.setState({ teams: teamsForUpdate });
      }
      break;
    case 'addToTeamScore':
      const teamsForAdd = [...store.teams];
      const teamToAdd = teamsForAdd.find(t => t.id === data.teamId);
      if (teamToAdd) {
        teamToAdd.scores[store.currentRoundIndex] += data.points;
        teamToAdd.totalScore = teamToAdd.scores.reduce((a, b) => a + b, 0);
        useQuizStore.setState({ teams: teamsForAdd });
      }
      break;
    case 'advanceF1Car':
      const newPositions = [...store.f1Positions];
      newPositions[data.teamId - 1] = Math.min(100, newPositions[data.teamId - 1] + data.amount);
      useQuizStore.setState({ f1Positions: newPositions });
      break;
    case 'toggleAnswer':
      useQuizStore.setState({ showAnswer: !store.showAnswer });
      break;
    case 'nextQuestion':
      // Ensure questions are loaded before advancing
      if (store.questions.length === 0) {
        loadQuestionsForCurrentRound();
      }
      store.nextQuestion();
      break;
    case 'previousQuestion':
      if (store.currentQuestionIndex > 0) {
        useQuizStore.setState({ currentQuestionIndex: store.currentQuestionIndex - 1, showAnswer: false });
      }
      break;
    case 'goToQuestion':
      useQuizStore.setState({ currentQuestionIndex: data.index, showAnswer: false });
      break;
    case 'resetGame':
      useQuizStore.setState({
        gameState: 'welcome',
        currentRoundIndex: 0,
        isTimerRunning: false,
        timerValue: 60,
        currentQuestionIndex: 0,
        showAnswer: false,
        f1Positions: [0, 0, 0],
      });
      break;
    case 'selectBoard':
      console.log('[QuizSync] Received selectBoard:', data);
      store.selectBoard(data.teamId, data.boardId);
      break;
    case 'teamTimeUp':
      console.log('[QuizSync] Received teamTimeUp');
      store.teamTimeUp();
      break;
    case 'nextPicture':
      console.log('[QuizSync] Received nextPicture');
      store.nextPicture();
      // Apply the state data if provided
      if (data?.currentPictureIndex !== undefined) {
        useQuizStore.setState({ currentPictureIndex: data.currentPictureIndex });
      }
      if (data?.showAllPictures !== undefined) {
        useQuizStore.setState({ showAllPictures: data.showAllPictures });
      }
      break;
    case 'previousPicture':
      console.log('[QuizSync] Received previousPicture');
      store.previousPicture();
      // Apply the state data if provided
      if (data?.currentPictureIndex !== undefined) {
        useQuizStore.setState({ currentPictureIndex: data.currentPictureIndex });
      }
      if (data?.showAllPictures !== undefined) {
        useQuizStore.setState({ showAllPictures: data.showAllPictures });
      }
      break;
    case 'resetPictureBoard':
      console.log('[QuizSync] Received resetPictureBoard');
      store.resetPictureBoard();
      break;
    case 'revealOnlyConnectOption':
      console.log('[QuizSync] Received revealOnlyConnectOption');
      store.revealOnlyConnectOption();
      break;
    case 'resetOnlyConnect':
      console.log('[QuizSync] Received resetOnlyConnect');
      store.resetOnlyConnect();
      break;
    default:
      console.warn('[QuizSync] Unknown action:', action);
  }
  
  console.log('[QuizSync] New state:', useQuizStore.getState().gameState);
}
