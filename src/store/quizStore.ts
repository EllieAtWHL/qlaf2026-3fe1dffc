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
  
  // F1 specific
  f1Positions: number[];
  
  // Actions
  startGame: () => void;
  nextRound: () => void;
  previousRound: () => void;
  goToRound: (index: number) => void;
  showTransition: () => void;
  startRound: () => void;
  showScores: () => void;
  showFinal: () => void;
  
  // Timer
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (duration?: number) => void;
  tick: () => void;
  
  // Scores
  updateTeamScore: (teamId: number, roundIndex: number, score: number) => void;
  addToTeamScore: (teamId: number, points: number) => void;
  
  // Questions
  nextQuestion: () => void;
  previousQuestion: () => void;
  toggleAnswer: () => void;
  loadQuestionsForCurrentRound: () => void;
  
  // F1
  updateF1Position: (teamId: number, position: number) => void;
  advanceF1Car: (teamId: number, amount: number) => void;
  
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
      set({ timerValue: timerValue - 1 });
    } else if (timerValue === 0) {
      set({ isTimerRunning: false });
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
      set({ currentQuestionIndex: currentQuestionIndex + 1, showAnswer: false });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1, showAnswer: false });
    }
  },
  
  loadQuestionsForCurrentRound: () => {
    const { currentRoundIndex } = get();
    const currentRoundId = getRoundIdByIndex(currentRoundIndex);
    
    // Use imported questions data
    const data = questionsData as any;
    const currentRoundData = data[currentRoundId];
    const questions = currentRoundData?.questions || [];
    set({ questions });
  },
  
  toggleAnswer: () => set(state => ({ showAnswer: !state.showAnswer })),
  
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
  
  resetGame: () => set({
    gameState: 'welcome',
    currentRoundIndex: 0,
    isTimerRunning: false,
    timerValue: 60,
    teams: initialTeams,
    currentQuestionIndex: 0,
    showAnswer: false,
    f1Positions: [0, 0, 0],
  }),
}));
