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
  | 'f1-grand-prix'
  | 'chris-stadia';

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

export interface OneMinuteBoard {
  id: string;
  name: string;
  oralQuestions: Array<{
    id: string;
    content: string;
    answer: string;
  }>;
  logoQuestion: {
    id: string;
    content: string;
    imageUrl: string;
    answer: string;
  };
  fillInTheBlank: {
    id: string;
    category: string;
    personalities: Array<{
      id: number;
      visiblePart: string;
      blankPart: string;
    }>;
  };
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
  currentBoard: PictureBoard | OneMinuteBoard | null;
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
  
  // Wipeout specific
  wipeoutRevealedAnswers: Set<number>;
  
  // Chris Stadia specific
  chrisStadiaRevealedCards: number[];
  chrisStadiaWatchRevealed: number[];
  chrisStadiaWatchShownOnScreen: number[];
  chrisStadiaCurrentSportingEvent: number | null;
  
  // One Minute Round specific
  oneMinuteBoards: OneMinuteBoard[];
  logoBlurLevel: number;
  revealedFillBlanks: number[];
  
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
  
  // Wipeout actions
  revealWipeoutAnswer: (answerIndex: number) => void;
  resetWipeout: () => void;
  
  // Chris Stadia actions
  setChrisStadiaRevealedCards: (cards: number[]) => void;
  resetChrisStadia: () => void;
  setChrisStadiaWatchRevealed: (cardIds: number[]) => void;
  setChrisStadiaWatchShownOnScreen: (cardIds: number[]) => void;
  setChrisStadiaCurrentSportingEvent: (cardId: number | null) => void;
  
  // One Minute Round actions
  initializeOneMinuteBoards: () => void;
  selectOneMinuteBoard: (boardId: string) => void;
  nextOneMinuteQuestion: () => void;
  previousOneMinuteQuestion: () => void;
  revealLogo: () => void;
  revealFillBlank: (personalityId: number) => void;
  resetOneMinuteRound: () => void;
  
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
  
  // Wipeout initial state
  wipeoutRevealedAnswers: new Set(),
  
  // Chris Stadia initial state
  chrisStadiaRevealedCards: [],
  chrisStadiaWatchRevealed: [],
  chrisStadiaWatchShownOnScreen: [],
  chrisStadiaCurrentSportingEvent: null,
  
  // One Minute Round initial state
  oneMinuteBoards: [],
  logoBlurLevel: 20,
  revealedFillBlanks: [],
  
  startGame: () => {
    set({ gameState: 'round-transition', currentRoundIndex: 0 });
    // Don't load questions yet - wait until round starts
  },
  
  nextRound: () => {
    const { currentRoundIndex } = get();
    console.log('nextRound called, currentRoundIndex:', currentRoundIndex);
    
    if (currentRoundIndex < ROUNDS.length - 1) {
      const newRoundIndex = currentRoundIndex + 1;
      const nextRoundId = getRoundIdByIndex(newRoundIndex);
      console.log('nextRound: transitioning to', nextRoundId);
      
      // Reset available boards when transitioning to One Minute Round
      if (nextRoundId === 'one-minute-round') {
        console.log('Resetting available boards for One Minute Round in nextRound');
        set({ 
          availableBoards: ['board-1', 'board-2', 'board-3'],
          currentBoard: null, // Explicitly reset currentBoard
          currentQuestionIndex: 0,
          logoBlurLevel: 20,
          revealedFillBlanks: []
        });
      }
      
      set({ 
        currentRoundIndex: newRoundIndex, 
        gameState: 'round-transition',
        currentQuestionIndex: 0,
        showAnswer: false,
        questions: [], // Clear questions during transition
        isTransitioning: true, // Explicitly mark as transitioning
        timerValue: 60, // Reset timer to 60 seconds when changing rounds
        isTimerRunning: false, // Stop timer during transition
        // Always reset currentBoard when changing rounds
        currentBoard: null
      });
      
      // Load questions after a brief delay to ensure transition state is set first
      setTimeout(() => {
        console.log('nextRound: calling loadQuestionsForCurrentRound');
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
        timerValue: 60, // Reset timer to 60 seconds when changing rounds
        isTimerRunning: false, // Stop timer during transition
        currentBoard: null // Always reset currentBoard when changing rounds
      });
    }
  },
  
  goToRound: (index: number) => {
    const targetRoundId = getRoundIdByIndex(index);
    
    // Reset available boards when going to One Minute Round
    if (targetRoundId === 'one-minute-round') {
      set({ availableBoards: ['board-1', 'board-2', 'board-3'] });
    }
    
    set({ 
      currentRoundIndex: index,
      gameState: 'round-transition',
      currentQuestionIndex: 0,
      showAnswer: false,
      questions: [], // Clear questions during transition
      timerValue: 60, // Reset timer to 60 seconds when changing rounds
      isTimerRunning: false, // Stop timer during transition
      // Always reset currentBoard when changing rounds
      currentBoard: null
    });
    // Don't load questions yet - wait until round starts
  },
  
  showTransition: () => set({ gameState: 'round-transition' }),
  startRound: () => {
    set({ gameState: 'round', isTransitioning: false });
    // Load questions for the current round when starting the round
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
        onlyConnectRevealedOptions: 1,
        // Reset Dave's Dozen answers when changing questions
        davesDozenRevealedAnswers: new Set(),
        davesDozenShowRedCross: false,
        // Reset Wipeout answers when changing questions
        wipeoutRevealedAnswers: new Set()
      });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ 
        currentQuestionIndex: currentQuestionIndex - 1, 
        showAnswer: false,
        onlyConnectRevealedOptions: 1,
        // Reset Dave's Dozen answers when changing questions
        davesDozenRevealedAnswers: new Set(),
        davesDozenShowRedCross: false,
        // Reset Wipeout answers when changing questions
        wipeoutRevealedAnswers: new Set()
      });
    }
  },
  
  goToQuestion: (index: number) => {
    set({ 
      currentQuestionIndex: index, 
      showAnswer: false,
      onlyConnectRevealedOptions: 1,
      // Reset Dave's Dozen answers when changing questions
      davesDozenRevealedAnswers: new Set(),
      davesDozenShowRedCross: false,
      // Reset Wipeout answers when changing questions
      wipeoutRevealedAnswers: new Set()
    });
  },
  
  loadQuestionsForCurrentRound: () => {
    const { currentRoundIndex } = get();
    const currentRoundId = getRoundIdByIndex(currentRoundIndex);
    
    // Use imported questions data
    const data = questionsData as unknown;
    const currentRoundData = (data as Record<string, unknown>)[currentRoundId];
    const questions = (currentRoundData as any)?.questions || [];
    set({ questions });
    
    // Auto-initialize picture boards if this is picture board round
    if (currentRoundId === 'picture-board') {
      const pictureBoardData = (data as Record<string, unknown>)['picture-board'];
      const boards = (pictureBoardData as any)?.boards || [];
      set({ 
        pictureBoards: boards,
        availableBoards: ['board-1', 'board-2', 'board-3'],
        selectedBoards: {},
        currentTeamSelecting: 1,
        currentBoard: null
      });
    }
    
    // Auto-initialize one minute boards if this is one minute round
    if (currentRoundId === 'one-minute-round') {
      console.log('Initializing One Minute Round in loadQuestionsForCurrentRound');
      const oneMinuteData = (data as Record<string, unknown>)['one-minute-round'];
      const boards = (oneMinuteData as any)?.boards || [];
      console.log('One Minute boards found:', boards.length);
      set({ 
        oneMinuteBoards: boards,
        availableBoards: ['board-1', 'board-2', 'board-3'],
        selectedBoards: {},
        currentTeamSelecting: 1,
        currentBoard: null,
        currentQuestionIndex: 0,
        logoBlurLevel: 20,
        revealedFillBlanks: []
      });
    }
  },
  
  toggleAnswer: () => set(state => ({ showAnswer: !state.showAnswer })),
  
  initializePictureBoards: () => {
    const data = questionsData as any;
    const pictureBoardData = data['picture-board'];
    const boards = pictureBoardData?.boards || [];
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
        set({ 
          currentBoard: selectedBoard,
          timerValue: 60, // Reset timer to 60 seconds when board is selected
          isTimerRunning: true // Automatically start timer
        });
      }
    }
  },
  
  teamTimeUp: () => {
    const { currentRoundIndex, currentTeamSelecting, selectedBoards, pictureBoards, oneMinuteBoards } = get();
    const currentRoundId = getRoundIdByIndex(currentRoundIndex);
    
    if (currentTeamSelecting === 4) {
      return; // Already at completion
    }
    
    // Prevent rapid successive calls
    if (Date.now() - get().lastTeamTimeUpCall < 500) {
      return;
    }
    
    const nextTeam = currentTeamSelecting + 1;
    
    if (nextTeam <= 3) {
      set({ 
        currentTeamSelecting: nextTeam,
        lastTeamTimeUpCall: Date.now(),
        // Reset progress for next team based on round type
        showAnswer: false
      });
      
      // Handle different round types
      if (currentRoundId === 'picture-board') {
        // Reset picture board progress for next team
        set({
          currentPictureIndex: 0,
          showAllPictures: false
        });
        
        // Set the current board for the next team
        const nextTeamBoardId = selectedBoards[nextTeam];
        if (nextTeamBoardId) {
          const nextTeamBoard = pictureBoards.find(board => board.id === nextTeamBoardId);
          if (nextTeamBoard) {
            set({ currentBoard: nextTeamBoard });
          }
        } else {
          set({ currentBoard: null });
        }
      } else if (currentRoundId === 'one-minute-round') {
        // Reset one minute round progress for next team
        set({
          currentQuestionIndex: 0,
          logoBlurLevel: 20,
          revealedFillBlanks: [],
          isTimerRunning: false
        });
        
        // Set the current board for the next team
        const nextTeamBoardId = selectedBoards[nextTeam];
        if (nextTeamBoardId) {
          const nextTeamBoard = oneMinuteBoards.find(board => board.id === nextTeamBoardId);
          if (nextTeamBoard) {
            set({ currentBoard: nextTeamBoard });
          }
        } else {
          set({ currentBoard: null });
        }
      }
    } else {
      // All teams have played, round is complete
      set({ currentTeamSelecting: 4 }); // Use 4 to indicate completion
    }
  },
  
  nextPicture: () => {
    const { currentBoard, currentPictureIndex } = get();
    
    if (currentBoard && 'pictures' in currentBoard) {
      if (currentPictureIndex < currentBoard.pictures.length - 1) {
        set({ currentPictureIndex: currentPictureIndex + 1 });
      } else if (currentPictureIndex === currentBoard.pictures.length - 1) {
        set({ showAllPictures: true });
      }
    }
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
  
  // One Minute Round actions
  initializeOneMinuteBoards: () => {
    const data = questionsData as unknown;
    const oneMinuteData = (data as Record<string, unknown>)['one-minute-round'];
    const boards = (oneMinuteData as any)?.boards || [];
    console.log('initializeOneMinuteBoards: setting', boards.length, 'boards and available boards');
    set({ 
      oneMinuteBoards: boards,
      availableBoards: ['board-1', 'board-2', 'board-3'],
      selectedBoards: {},
      currentTeamSelecting: 1,
      currentBoard: null,
      currentQuestionIndex: 0,
      logoBlurLevel: 20,
      revealedFillBlanks: []
    });
  },
  
  selectOneMinuteBoard: (boardId: string) => {
    console.log('selectOneMinuteBoard called with boardId:', boardId);
    const { oneMinuteBoards, availableBoards, selectedBoards, currentTeamSelecting } = get();
    console.log('selectOneMinuteBoard - oneMinuteBoards count:', oneMinuteBoards?.length || 'undefined');
    console.log('selectOneMinuteBoard - availableBoards:', availableBoards);
    console.log('selectOneMinuteBoard - selectedBoards:', selectedBoards);
    console.log('selectOneMinuteBoard - currentTeamSelecting:', currentTeamSelecting);
    
    const selectedBoard = oneMinuteBoards.find(board => board.id === boardId);
    console.log('selectOneMinuteBoard - found board:', selectedBoard?.name);
    if (selectedBoard) {
      console.log('selectOneMinuteBoard - setting currentBoard and starting timer');
      
      const newSelectedBoards = { ...selectedBoards, [currentTeamSelecting]: boardId };
      const newAvailableBoards = availableBoards.filter(id => id !== boardId);
      
      set({ 
        currentBoard: selectedBoard,
        selectedBoards: newSelectedBoards,
        availableBoards: newAvailableBoards,
        // Reset question index when selecting new board
        currentQuestionIndex: 0,
        // Reset timer to 60 seconds when selecting One Minute Round board
        timerValue: 60,
        isTimerRunning: true // Auto-start timer for One Minute Round
      });
    } else {
      console.log('selectOneMinuteBoard - board not found! Available boards:', oneMinuteBoards?.map(b => b.id));
      console.log('selectOneMinuteBoard - Available board IDs:', oneMinuteBoards?.map(b => b.id));
    }
  },
  
  nextOneMinuteQuestion: () => {
    const { currentQuestionIndex } = get();
    console.log('[OneMinuteRound] nextOneMinuteQuestion called, currentQuestionIndex:', currentQuestionIndex);
    // One Minute Round has 9 questions total (indices 0-8)
    // Questions 0-5: oral questions, 6: logo, 7-9: fill-in-the-blank
    if (currentQuestionIndex < 8) {
      const newIndex = currentQuestionIndex + 1;
      console.log('[OneMinuteRound] Advancing to question index:', newIndex);
      set({ currentQuestionIndex: newIndex });
    } else {
      console.log('[OneMinuteRound] Already at last question, cannot advance');
    }
  },
  
  previousOneMinuteQuestion: () => {
    const { currentQuestionIndex } = get();
    console.log('[OneMinuteRound] previousOneMinuteQuestion called, currentQuestionIndex:', currentQuestionIndex);
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      console.log('[OneMinuteRound] Going back to question index:', newIndex);
      set({ currentQuestionIndex: newIndex });
    } else {
      console.log('[OneMinuteRound] Already at first question, cannot go back');
    }
  },
  
  revealLogo: () => {
    const { logoBlurLevel } = get();
    if (logoBlurLevel > 0) {
      set({ logoBlurLevel: Math.max(0, logoBlurLevel - 5) });
    }
  },
  
  revealFillBlank: (personalityId: number) => {
    const { revealedFillBlanks } = get();
    if (!revealedFillBlanks.includes(personalityId)) {
      set({ revealedFillBlanks: [...revealedFillBlanks, personalityId] });
    }
  },
  
  resetOneMinuteRound: () => {
    set({ 
      currentBoard: null,
      currentQuestionIndex: 0,
      logoBlurLevel: 20,
      revealedFillBlanks: []
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
    newPositions[teamId - 1] = Math.min(100, Math.max(0, newPositions[teamId - 1] + amount));
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
  
  // Wipeout actions
  revealWipeoutAnswer: (answerIndex: number) => {
    const { wipeoutRevealedAnswers } = get();
    const newRevealed = new Set(wipeoutRevealedAnswers);
    newRevealed.add(answerIndex);
    set({ wipeoutRevealedAnswers: newRevealed });
  },
  
  resetWipeout: () => {
    set({ wipeoutRevealedAnswers: new Set() });
  },
  
  // Chris Stadia actions
  setChrisStadiaRevealedCards: (cards: number[]) => {
    set({ chrisStadiaRevealedCards: cards });
  },
  
  resetChrisStadia: () => {
    set({ 
      chrisStadiaRevealedCards: [], 
      chrisStadiaWatchRevealed: [],
      chrisStadiaWatchShownOnScreen: [],
      chrisStadiaCurrentSportingEvent: null
    });
  },
  
  setChrisStadiaCurrentSportingEvent: (cardId: number | null) => {
    set({ chrisStadiaCurrentSportingEvent: cardId });
  },

  setChrisStadiaWatchRevealed: (cardIds: number[]) => {
    set({ chrisStadiaWatchRevealed: cardIds });
  },
  
  setChrisStadiaWatchShownOnScreen: (cardIds: number[]) => {
    set({ chrisStadiaWatchShownOnScreen: cardIds });
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
    wipeoutRevealedAnswers: new Set(),
    chrisStadiaRevealedCards: [],
    chrisStadiaWatchRevealed: [],
    chrisStadiaWatchShownOnScreen: [],
    chrisStadiaCurrentSportingEvent: null,
  }),
}));
