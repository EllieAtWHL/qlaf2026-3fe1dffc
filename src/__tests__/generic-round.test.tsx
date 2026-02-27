/**
 * GenericRound Component Tests
 * 
 * Tests the GenericRound component which handles multiple round types:
 * - Just One (individual answers, avoid duplicates)
 * - Round Robin (turn-based answering until wrong/repeat/can't answer)
 * - Distinctly Average (guess the average)
 * - Wipeout (risk vs reward)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GenericRound } from '@/components/rounds/GenericRound';

// Mock the hooks
const mockUseQuizStore = {
  currentRoundIndex: 0,
  showAnswer: false,
  currentQuestionIndex: 0,
  gameState: 'round' as 'welcome' | 'round-transition' | 'round' | 'scores' | 'final',
  isTransitioning: false,
  timerValue: 60,
  isTimerRunning: false
};

const mockUseQuestions = {
  questions: [],
  currentQuestion: {
    id: 'test-1',
    type: 'single' as const,
    content: 'Test question content',
    answer: 'Test answer',
    points: 10
  },
  currentQuestionIndex: 0,
  totalQuestions: 3,
  hasNextQuestion: true,
  hasPreviousQuestion: false,
  getQuestionsForRound: vi.fn(),
  currentRoundId: 'just-one' as const,
  isLoading: false,
  error: null
};

vi.mock('@/store/quizStore', () => ({
  useQuizStore: vi.fn(() => mockUseQuizStore),
  ROUNDS: [
    { 
      id: 'just-one', 
      name: "Just One", 
      description: "Give a unique answer", 
      timerDuration: null, 
      isTeamRound: false, 
      component: 'GenericRound', 
      icon: 'Users' 
    },
    { 
      id: 'round-robin', 
      name: "Round Robin", 
      description: "Take turns answering", 
      timerDuration: null, 
      isTeamRound: false, 
      component: 'GenericRound', 
      icon: 'RotateCcw' 
    },
    { 
      id: 'distinctly-average', 
      name: "Distinctly Average", 
      description: "Guess the average", 
      timerDuration: null, 
      isTeamRound: false, 
      component: 'GenericRound', 
      icon: 'Calculator' 
    },
    { 
      id: 'wipeout', 
      name: "Wipeout", 
      description: "Risk vs reward", 
      timerDuration: null, 
      isTeamRound: true, 
      component: 'GenericRound', 
      icon: 'Skull' 
    }
  ]
}));

vi.mock('@/hooks/useQuestions', () => ({
  useQuestions: vi.fn(() => mockUseQuestions)
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

// Mock child components
vi.mock('@/components/Timer', () => ({
  Timer: () => <div data-testid="timer">Timer Component</div>
}));

vi.mock('@/components/Scoreboard', () => ({
  Scoreboard: ({ compact }: { compact?: boolean }) => 
    <div data-testid="scoreboard" data-compact={compact}>Scoreboard</div>
}));

import { useQuizStore } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';

describe('GenericRound Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to default state
    mockUseQuizStore.showAnswer = false;
    mockUseQuizStore.currentRoundIndex = 0;
    mockUseQuizStore.currentQuestionIndex = 0;
    mockUseQuestions.currentQuestionIndex = 0;
  });

  describe('Basic Rendering', () => {
    it('should render round information correctly', () => {
      render(<GenericRound />);
      
      expect(screen.getByText('Round 1')).toBeInTheDocument();
      expect(screen.getByText('Just One')).toBeInTheDocument();
    });

    it('should render question content when available', () => {
      render(<GenericRound />);
      
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Test question content')).toBeInTheDocument();
    });

    it('should render scoreboard in compact mode', () => {
      render(<GenericRound />);
      
      const scoreboard = screen.getByTestId('scoreboard');
      expect(scoreboard).toBeInTheDocument();
      expect(scoreboard).toHaveAttribute('data-compact', 'true');
    });
  });

  describe('Answer Display', () => {
    it('should not show answer when showAnswer is false', () => {
      mockUseQuizStore.showAnswer = false;
      render(<GenericRound />);
      
      expect(screen.queryByText('Answer')).not.toBeInTheDocument();
      expect(screen.queryByText('Test answer')).not.toBeInTheDocument();
    });

    it('should show answer when showAnswer is true', () => {
      mockUseQuizStore.showAnswer = true;
      render(<GenericRound />);
      
      expect(screen.getByText('Answer')).toBeInTheDocument();
      expect(screen.getByText('Test answer')).toBeInTheDocument();
    });

    it('should display points when available', () => {
      mockUseQuizStore.showAnswer = true;
      render(<GenericRound />);
      
      expect(screen.getByText('10 points')).toBeInTheDocument();
    });
  });

  describe('Different Round Types', () => {
    it('should render Round Robin correctly', () => {
      mockUseQuizStore.currentRoundIndex = 1;
      mockUseQuestions.currentQuestion = null;
      
      render(<GenericRound />);
      
      expect(screen.getByText('Round 2')).toBeInTheDocument();
      expect(screen.getByText('Take turns answering')).toBeInTheDocument();
    });

    it('should render Distinctly Average correctly', () => {
      mockUseQuizStore.currentRoundIndex = 2;
      mockUseQuestions.currentQuestion = null;
      
      render(<GenericRound />);
      
      expect(screen.getByText('Round 3')).toBeInTheDocument();
      expect(screen.getByText('Guess the average')).toBeInTheDocument();
    });

    it('should render Wipeout correctly', () => {
      mockUseQuizStore.currentRoundIndex = 3;
      mockUseQuestions.currentQuestion = null;
      
      render(<GenericRound />);
      
      expect(screen.getByText('Round 4')).toBeInTheDocument();
      expect(screen.getByText('Risk vs reward')).toBeInTheDocument();
    });
  });

  describe('State Handling', () => {
    it('should not render during transition', () => {
      mockUseQuizStore.isTransitioning = true;
      
      const { container } = render(<GenericRound />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should not render when not in round state', () => {
      mockUseQuizStore.gameState = 'welcome';
      
      const { container } = render(<GenericRound />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should render when in round state and not transitioning', () => {
      mockUseQuizStore.gameState = 'round';
      mockUseQuizStore.isTransitioning = false;
      
      const { container } = render(<GenericRound />);
      
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply correct CSS classes for layout', () => {
      const { container } = render(<GenericRound />);
      
      expect(container.querySelector('.main-display-round')).toBeInTheDocument();
      expect(container.querySelector('.qlaf-bg')).toBeInTheDocument();
      expect(container.querySelector('.glass-card')).toBeInTheDocument();
    });

    it('should have QLAF branding', () => {
      render(<GenericRound />);
      
      expect(screen.getByText('QLAF 2026')).toBeInTheDocument();
    });
  });
});
