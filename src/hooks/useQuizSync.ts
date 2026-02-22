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
    if (_disabled) {
      return;
    }
    
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    
    const channel = supabase.channel(CHANNEL_NAME, {
      config: {
        broadcast: { self: false }, // Don't receive own broadcasts
      },
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'state-update' }, ({ payload }) => {
        if (payload?.action) {
          applyStateUpdate(payload.action, payload.data);
        }
      })
      .subscribe((status) => {
        // Channel status updates
      });

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [_disabled]);

  const broadcastAction = (action: string, data?: any) => {
    if (!channelRef.current || _disabled) {
      return;
    }

    channelRef.current.send({
      type: 'broadcast',
      event: 'state-update',
      payload: { action, data },
    });
  };

  return { broadcastAction };
};

function loadQuestionsForCurrentRound() {
  try {
    const store = useQuizStore.getState();
    const currentRoundId = getRoundIdByIndex(store.currentRoundIndex);
    
    const data = questionsData as any;
    const currentRoundData = data[currentRoundId];
    
    if (!currentRoundData) {
      useQuizStore.setState({ questions: [] });
      return;
    }
    
    const questions = currentRoundData?.questions || [];
    
    useQuizStore.setState({ questions });
  } catch (error) {
    console.error('Failed to load questions:', error);
    useQuizStore.setState({ questions: [] });
  }
}

function applyStateUpdate(action: string, data: any) {
  const store = useQuizStore.getState();

  switch (action) {
    case 'startGame':
      useQuizStore.setState({ gameState: 'round-transition', currentRoundIndex: 0 });
      // Don't load questions yet - wait until round starts
      break;
    case 'startRound':
      useQuizStore.setState({ gameState: 'round', isTransitioning: false });
      loadQuestionsForCurrentRound();
      
      const currentRoundId = getRoundIdByIndex(useQuizStore.getState().currentRoundIndex);
      if (currentRoundId === 'picture-board') {
        const data = questionsData as any;
        const pictureBoardData = data['picture-board'];
        const boards = pictureBoardData?.boards || [];
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
        const newRoundIndex = store.currentRoundIndex + 1;
        useQuizStore.setState({ 
          currentRoundIndex: newRoundIndex, 
          gameState: 'round-transition',
          currentQuestionIndex: 0,
          showAnswer: false,
          questions: [], // Clear questions during transition
          isTransitioning: true, // Explicitly mark as transitioning
        });
        
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
      if (store.questions.length === 0) {
        loadQuestionsForCurrentRound();
      }
      store.nextQuestion();
      break;
    case 'previousQuestion':
      if (store.currentQuestionIndex > 0) {
        useQuizStore.setState({ 
          currentQuestionIndex: store.currentQuestionIndex - 1, 
          showAnswer: false,
          onlyConnectRevealedOptions: 1,
          // Reset Dave's Dozen answers when changing questions
          davesDozenRevealedAnswers: new Set(),
          davesDozenShowRedCross: false
        });
      }
      break;
    case 'goToQuestion':
      useQuizStore.setState({ 
        currentQuestionIndex: data.index, 
        showAnswer: false,
        onlyConnectRevealedOptions: 1,
        // Reset Dave's Dozen answers when changing questions
        davesDozenRevealedAnswers: new Set(),
        davesDozenShowRedCross: false
      });
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
      store.selectBoard(data.teamId, data.boardId);
      break;
    case 'teamTimeUp':
      store.teamTimeUp();
      break;
    case 'nextPicture':
      store.nextPicture();
      break;
    case 'previousPicture':
      store.previousPicture();
      break;
    case 'resetPictureBoard':
      store.resetPictureBoard();
      break;
    case 'revealOnlyConnectOption':
      store.revealOnlyConnectOption();
      break;
    case 'resetOnlyConnect':
      store.resetOnlyConnect();
      break;
    case 'revealDavesDozenAnswer':
      store.revealDavesDozenAnswer(data.answerNumber);
      break;
    case 'showIncorrectAnswer':
      store.showIncorrectAnswer();
      break;
    case 'resetDavesDozen':
      store.resetDavesDozen();
      break;
    default:
      console.warn('Unknown action:', action);
  }
};
