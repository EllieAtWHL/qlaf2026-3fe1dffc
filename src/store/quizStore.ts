import { create } from 'zustand';
import questionsData from '@/data/questions.json';
import roundsData from '@/data/rounds.json';
import { getRoundIdByIndex } from '@/utils/roundUtils';

export type RoundType = 
  | 'world-rankings'
  | 'just-one'
  | 'picture-board'
  | 'only-connect'
  | 'round-robin'
  | 'daves-dozen'
  | 'ellies-tellies'
  | 'distinctly-average'
  | 'wipeout'
  | 'one-minute-round'
  | 'f1-grand-prix';

export interface Round {
  id: string;
  name: string;
  description: string;
  timerDuration?: number; // in seconds, undefined means no timer
  isTeamRound: boolean;
  component: string; // Component name to render
  icon: string; // Icon name for Lucide icons
}

export interface Team {
  id: number;
  name: string;
  scores: number[]; // scores per round
  totalScore: number;
  f1Position: number; // for F1 finale (0-100%)
}

export interface PictureBoard {
  id: string;
  name: string;
  imageUrl: string;
  pictures: Array<{
    id: number;
    answer: string;
    imageUrl: string;
  }>;
}

export interface Question {
  id: string;
  roundType: RoundType;
  type: string;
  content: string;
  options?: string[];
  answer: string | string[];
  imageUrl?: string;
  points?: number;
}

export const ROUNDS: Round[] = roundsData.rounds;

interface QuizState {
  // Quiz state
  gameState: 'welcome' | 'round' | 'round-transition' | 'scores' | 'final';
  currentRoundIndex: number;
  isTimerRunning: boolean;
  timerValue: number;
  teams: Team[];
  
  // Transition state
  isTransitioning: boolean;
  
  // Questions
  currentQuestionIndex: number;
  questions: Question[];
  showAnswer: boolean;
  
  // Picture Board state
  availableBoards: string[];
  selectedBoards: { [key: number]: string };
  currentTeamSelecting: number;
  pictureBoards: PictureBoard[];
  currentBoard: PictureBoard | null;
  currentPictureIndex: number;
  showAllPictures: boolean;
  lastTeamTimeUpCall: number | null;
  
  // F1 specific
  f1Positions: number[];
  
  // Only Connect specific
  onlyConnectRevealedOptions: number;
  
  // Dave's Dozen specific
  davesDozenRevealedAnswers: Set<number>;
  davesDozenShowRedCross: boolean;
  
  // Actions
  startGame: () => void;
  startRound: () => void;
  nextRound: () => void;
  previousRound: () => void;
  goToRound: (index: number) => void;
  showTransition: () => void;
  showScores: () => void;
  showFinal: () => void;
  
  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (duration?: number) => void;
  tick: () => void;
  
  // Question actions
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  toggleAnswer: () => void;
  
  // Team actions
  updateTeamScore: (teamId: number, roundIndex: number, score: number) => void;
  addToTeamScore: (teamId: number, points: number) => void;
  advanceF1Car: (teamId: number, amount: number) => void;
  
  // Picture Board actions
  loadQuestionsForCurrentRound: () => void;
  initializePictureBoards: () => void;
  selectBoard: (teamId: number, boardId: string) => void;
  teamTimeUp: () => void;
  nextPicture: () => void;
  previousPicture: () => void;
  resetPictureBoard: () => void;
  
  // Only Connect actions
  revealOnlyConnectOption: () => void;
  resetOnlyConnect: () => void;
  
  // Dave's Dozen actions
  revealDavesDozenAnswer: (answerNumber: number) => void;
  showIncorrectAnswer: () => void;
  resetDavesDozen: () => void;
  
  // Game actions
  // Reset
  resetGame: () => void;
}

const initialTeams: Team[] = [
  { id: 1, name: 'Team 1', scores: Array(ROUNDS.length).fill(0), totalScore: 0, f1Position: 0 },
  { id: 2, name: 'Team 2', scores: Array(ROUNDS.length).fill(0), totalScore: 0, f1Position: 0 },
  { id: 3, name: 'Team 3', scores: Array(ROUNDS.length).fill(0), totalScore: 0, f1Position: 0 },
];

export const useQuizStore = create<QuizState>((set, get) => ({
  gameState: 'welcome',
  currentRoundIndex: 0,
  isTimerRunning: false,
  timerValue: 60,
  teams: initialTeams,
  isTransitioning: false,
  currentQuestionIndex: 0,
  questions: [],
  showAnswer: false,
  f1Positions: [0, 0, 0],
  
  // Picture Board initial state
  availableBoards: [],
  selectedBoards: {},
  currentTeamSelecting: 1,
  pictureBoards: [],
  currentBoard: null,
  currentPictureIndex: 0,
  showAllPictures: false,
  lastTeamTimeUpCall: null,
  
  // Only Connect initial state
  onlyConnectRevealedOptions: 1,
  
  // Dave's Dozen initial state
  davesDozenRevealedAnswers: new Set(),
  davesDozenShowRedCross: false,
  
  startGame: () => {
    set({ gameState: 'round-transition', currentRoundIndex: 0 });
    // Load questions for the first round
    get().loadQuestionsForCurrentRound();
  },
  
  nextRound: () => {
    const { currentRoundIndex } = get();
    
    if (currentRoundIndex < ROUNDS.length - 1) {
      const newRoundIndex = currentRoundIndex + 1;
      
      set({ 
        currentRoundIndex: newRoundIndex, 
        gameState: 'round-transition',
        currentQuestionIndex: 0,
        showAnswer: false,
        questions: [], // Clear questions during transition
        isTransitioning: true, // Explicitly mark as transitioning
      });
      
      // Load questions after a brief delay to ensure transition state is set first
      setTimeout(() => {
        get().loadQuestionsForCurrentRound();
        set({ isTransitioning: false }); // End transition after questions are loaded
      }, 100);
    }
  },
  
  previousRound: () => {
    const { currentRoundIndex } = get();
    if (currentRoundIndex > 0) {
      set({ 
        currentRoundIndex: currentRoundIndex - 1,
        gameState: 'round-transition',
        currentQuestionIndex: 0,
        showAnswer: false,
        questions: [], // Clear questions during transition
      });
    }
  },
  
  goToRound: (index: number) => {
    set({ 
      currentRoundIndex: index,
      gameState: 'round-transition',
      currentQuestionIndex: 0,
      showAnswer: false,
      questions: [], // Clear questions during transition
    });
    // Don't load questions yet - wait until round starts
  },
  
  showTransition: () => set({ gameState: 'round-transition' }),
  startRound: () => {
    set({ gameState: 'round', isTransitioning: false });
    // Load questions for the current round
    get().loadQuestionsForCurrentRound();
  },
  showScores: () => set({ gameState: 'scores' }),
  showFinal: () => set({ gameState: 'final' }),
  
  startTimer: () => set({ isTimerRunning: true }),
  pauseTimer: () => set({ isTimerRunning: false }),
  
  resetTimer: (duration?: number) => {
    const { currentRoundIndex } = get();
    const round = ROUNDS[currentRoundIndex];
    set({ 
      timerValue: duration ?? round.timerDuration ?? 60, 
      isTimerRunning: false 
    });
  },
  
  tick: () => {
    const { timerValue, isTimerRunning } = get();
    if (isTimerRunning && timerValue > 0) {
      const newValue = timerValue - 1;
      set({ 
        timerValue: newValue,
        isTimerRunning: newValue > 0 ? true : false
      });
    }
  },
  
  updateTeamScore: (teamId: number, roundIndex: number, score: number) => {
    const { teams } = get();
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const newScores = [...team.scores];
        newScores[roundIndex] = score;
        return {
          ...team,
          scores: newScores,
          totalScore: newScores.reduce((a, b) => a + b, 0),
        };
      }
      return team;
    });
    set({ teams: updatedTeams });
  },
  
  addToTeamScore: (teamId: number, points: number) => {
    const { teams, currentRoundIndex } = get();
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const newScores = [...team.scores];
        newScores[currentRoundIndex] += points;
        return {
          ...team,
          scores: newScores,
          totalScore: newScores.reduce((a, b) => a + b, 0),
        };
      }
      return team;
    });
    set({ teams: updatedTeams });
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ 
        currentQuestionIndex: currentQuestionIndex + 1, 
        showAnswer: false,
        onlyConnectRevealedOptions: 1 
      });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ 
        currentQuestionIndex: currentQuestionIndex - 1, 
        showAnswer: false,
        onlyConnectRevealedOptions: 1 
      });
    }
  },
  
  goToQuestion: (index: number) => {
    set({ 
      currentQuestionIndex: index, 
      showAnswer: false,
      onlyConnectRevealedOptions: 1 
    });
  },
  
  loadQuestionsForCurrentRound: () => {
    const { currentRoundIndex } = get();
    const currentRoundId = getRoundIdByIndex(currentRoundIndex);
    
    // Use imported questions data
    const data = questionsData as any;
    const currentRoundData = data[currentRoundId];
    const questions = currentRoundData?.questions || [];
    set({ questions });
    
    // Auto-initialize picture boards if this is the picture board round
    if (currentRoundId === 'picture-board') {
      const pictureBoardData = data['picture-board'];
      const boards = pictureBoardData?.boards || [];
      set({ 
        pictureBoards: boards,
        availableBoards: ['board-1', 'board-2', 'board-3'],
        selectedBoards: {},
        currentTeamSelecting: 1,
        currentBoard: null
      });
    }
  },
  
  toggleAnswer: () => set(state => ({ showAnswer: !state.showAnswer })),
  
  initializePictureBoards: () => {
    console.log('Initializing picture boards...');
    const data = questionsData as any;
    console.log('Questions data:', data);
    const pictureBoardData = data['picture-board'];
    console.log('Picture board data:', pictureBoardData);
    const boards = pictureBoardData?.boards || [];
    console.log('Boards found:', boards);
    set({ 
      pictureBoards: boards,
      availableBoards: ['board-1', 'board-2', 'board-3'],
      selectedBoards: {},
      currentTeamSelecting: 1,
      currentBoard: null
    });
  },
  
  selectBoard: (teamId: number, boardId: string) => {
    const { availableBoards, selectedBoards, pictureBoards } = get();
    
    const newSelectedBoards = { ...selectedBoards, [teamId]: boardId };
    const newAvailableBoards = availableBoards.filter(id => id !== boardId);
    
    set({
      selectedBoards: newSelectedBoards,
      availableBoards: newAvailableBoards,
      // Don't advance currentTeamSelecting here - let teamTimeUp handle that
    });
    
    // Set the current board if this is the current team selecting
    if (teamId === get().currentTeamSelecting) {
      const selectedBoard = pictureBoards.find(board => board.id === boardId);
      if (selectedBoard) {
        set({ currentBoard: selectedBoard });
      }
    }
  },
  
  teamTimeUp: () => {
    const { currentTeamSelecting, selectedBoards, pictureBoards } = get();
    
    console.log('[teamTimeUp] === START ===');
    console.log('[teamTimeUp] Current team selecting:', currentTeamSelecting);
    console.log('[teamTimeUp] Selected boards:', selectedBoards);
    
    // Prevent multiple calls if already at completion
    if (currentTeamSelecting >= 4) {
      console.log('[teamTimeUp] Already at completion, ignoring call');
      return;
    }
    
    // Prevent rapid successive calls (debounce protection)
    const now = Date.now();
    if (get().lastTeamTimeUpCall && now - get().lastTeamTimeUpCall < 1000) {
      console.log('[teamTimeUp] Rapid call detected, ignoring');
      return;
    }
    
    // Store the timestamp of this call
    set({ lastTeamTimeUpCall: now });
    
    // Reset timer when time is up
    get().resetTimer(60);
    
    // Move to next team or finish if all teams have played
    if (currentTeamSelecting < 3) {
      const nextTeam = currentTeamSelecting + 1;
      console.log('[teamTimeUp] Moving to next team:', nextTeam);
      set({ currentTeamSelecting: nextTeam });
      
      // Reset picture board state for the new team
      set({ currentPictureIndex: 0, showAllPictures: false });
      
      // Set the current board for the next team if they've already selected
      const nextTeamBoardId = selectedBoards[nextTeam];
      if (nextTeamBoardId) {
        const nextTeamBoard = pictureBoards.find(board => board.id === nextTeamBoardId);
        if (nextTeamBoard) {
          set({ currentBoard: nextTeamBoard });
        }
      } else {
        set({ currentBoard: null });
      }
    } else {
      // All teams have played, round is complete
      console.log('[teamTimeUp] All teams have played, setting currentTeamSelecting to 4');
      set({ currentTeamSelecting: 4 }); // Use 4 to indicate completion
    }
    
    console.log('[teamTimeUp] === END ===');
  },
  
  nextPicture: () => {
    const startTime = performance.now();
    const { currentBoard, currentPictureIndex } = get();
    
    if (currentBoard) {
      if (currentPictureIndex < currentBoard.pictures.length - 1) {
        set({ currentPictureIndex: currentPictureIndex + 1 });
      } else if (currentPictureIndex === currentBoard.pictures.length - 1) {
        set({ showAllPictures: true });
      }
    }
    
    const endTime = performance.now();
    console.log(`[nextPicture] Execution time: ${endTime - startTime}ms`);
  },
  
  previousPicture: () => {
    const { currentPictureIndex, showAllPictures } = get();
    
    if (showAllPictures) {
      set({ showAllPictures: false, currentPictureIndex: 11 });
    } else if (currentPictureIndex > 0) {
      set({ currentPictureIndex: currentPictureIndex - 1 });
    }
  },
  
  resetPictureBoard: () => {
    set({ 
      currentPictureIndex: 0, 
      showAllPictures: false 
    });
  },
  
  updateF1Position: (teamId: number, position: number) => {
    const { f1Positions } = get();
    const newPositions = [...f1Positions];
    newPositions[teamId - 1] = Math.min(100, Math.max(0, position));
    set({ f1Positions: newPositions });
  },
  
  advanceF1Car: (teamId: number, amount: number) => {
    const { f1Positions } = get();
    const newPositions = [...f1Positions];
    newPositions[teamId - 1] = Math.min(100, newPositions[teamId - 1] + amount);
    set({ f1Positions: newPositions });
  },
  
  // Only Connect actions
  revealOnlyConnectOption: () => {
    const { onlyConnectRevealedOptions } = get();
    // Prevent revealing more than 4 options
    if (onlyConnectRevealedOptions >= 4) return;
    set({ onlyConnectRevealedOptions: onlyConnectRevealedOptions + 1 });
  },
  
  resetOnlyConnect: () => {
    set({ onlyConnectRevealedOptions: 0 });
  },
  
  // Dave's Dozen actions
  revealDavesDozenAnswer: (answerNumber: number) => {
    const { davesDozenRevealedAnswers } = get();
    const newRevealed = new Set(davesDozenRevealedAnswers);
    newRevealed.add(answerNumber);
    set({ davesDozenRevealedAnswers: newRevealed });
  },
  
  showIncorrectAnswer: () => {
    set({ davesDozenShowRedCross: true });
    // Auto-hide after 2 seconds
    setTimeout(() => {
      set({ davesDozenShowRedCross: false });
    }, 2000);
  },
  
  resetDavesDozen: () => {
    set({ 
      davesDozenRevealedAnswers: new Set(),
      davesDozenShowRedCross: false 
    });
  },
  
  resetGame: () => set({
    gameState: 'welcome',
    currentRoundIndex: 0,
    isTimerRunning: false,
    timerValue: 60,
    teams: initialTeams,
    currentQuestionIndex: 0,
    showAnswer: false,
    f1Positions: [0, 0, 0],
    availableBoards: ['board-1', 'board-2', 'board-3'],
    selectedBoards: {},
    currentTeamSelecting: 1,
    pictureBoards: [],
    currentBoard: null,
    onlyConnectRevealedOptions: 1,
    davesDozenRevealedAnswers: new Set(),
    davesDozenShowRedCross: false,
  }),
}));
