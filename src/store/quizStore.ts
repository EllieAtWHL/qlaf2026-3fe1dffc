import { create } from 'zustand';

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
  id: RoundType;
  name: string;
  description: string;
  timerDuration?: number; // in seconds, undefined means no timer
  isTeamRound: boolean;
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

export const ROUNDS: Round[] = [
  { id: 'world-rankings', name: 'World Rankings', description: 'Rank items in order', isTeamRound: true },
  { id: 'just-one', name: 'Just One', description: 'Give a unique answer', isTeamRound: false },
  { id: 'picture-board', name: 'Picture Board', description: 'Identify the images', timerDuration: 60, isTeamRound: true },
  { id: 'only-connect', name: 'Only Connect', description: 'Find the connection', isTeamRound: true },
  { id: 'round-robin', name: 'Round Robin', description: 'Take turns answering', isTeamRound: false },
  { id: 'daves-dozen', name: "Dave's Dozen", description: 'Auction-style bidding', isTeamRound: true },
  { id: 'ellies-tellies', name: "Ellie's Tellies", description: 'Picture round', isTeamRound: true },
  { id: 'distinctly-average', name: 'Distinctly Average', description: 'Guess the average', isTeamRound: false },
  { id: 'wipeout', name: 'Wipeout', description: 'Risk vs reward', isTeamRound: true },
  { id: 'one-minute-round', name: 'One Minute Round', description: 'Quick fire questions', timerDuration: 60, isTeamRound: true },
  { id: 'f1-grand-prix', name: 'F1 Grand Prix Final', description: 'The final race!', isTeamRound: true },
];

interface QuizState {
  // Quiz state
  gameState: 'welcome' | 'round' | 'round-transition' | 'scores' | 'final';
  currentRoundIndex: number;
  isTimerRunning: boolean;
  timerValue: number;
  teams: Team[];
  
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
  currentQuestionIndex: 0,
  questions: [],
  showAnswer: false,
  f1Positions: [0, 0, 0],
  
  startGame: () => set({ gameState: 'round-transition', currentRoundIndex: 0 }),
  
  nextRound: () => {
    const { currentRoundIndex } = get();
    if (currentRoundIndex < ROUNDS.length - 1) {
      set({ 
        currentRoundIndex: currentRoundIndex + 1, 
        gameState: 'round-transition',
        currentQuestionIndex: 0,
        showAnswer: false,
      });
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
      });
    }
  },
  
  goToRound: (index: number) => {
    if (index >= 0 && index < ROUNDS.length) {
      set({ 
        currentRoundIndex: index,
        gameState: 'round-transition',
        currentQuestionIndex: 0,
        showAnswer: false,
      });
    }
  },
  
  showTransition: () => set({ gameState: 'round-transition' }),
  startRound: () => set({ gameState: 'round' }),
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
