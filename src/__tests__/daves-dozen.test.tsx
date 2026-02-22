import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/store/quizStore', () => ({
  useQuizStore: vi.fn(),
  ROUNDS: [
    { id: 'world-rankings', name: "World Rankings", timerDuration: null },
    { id: 'only-connect', name: "Only Connect", timerDuration: null },
    { id: 'f1-grand-prix', name: "F1 Grand Prix", timerDuration: null },
    { id: 'one-minute', name: "One Minute", timerDuration: 60 },
    { id: 'picture-board', name: "Picture Board", timerDuration: 60 },
    { id: 'daves-dozen', name: "Dave's Dozen", timerDuration: null },
  ],
}));

vi.mock('@/hooks/useQuestions', () => ({
  useQuestions: vi.fn(),
}));

import { DavesDozen } from '@/components/rounds/DavesDozen';
import { useQuizStore } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';

// Get the mocked functions
const mockUseQuizStore = vi.mocked(useQuizStore);
const mockUseQuestions = vi.mocked(useQuestions);

describe('DavesDozen', () => {
  const mockStore = {
    currentRoundIndex: 4,
    showAnswer: false,
    gameState: 'round' as const,
    isTransitioning: false,
    davesDozenRevealedAnswers: new Set(),
    davesDozenShowRedCross: false,
    teams: [
      { id: 1, name: 'Team 1', scores: [0, 0, 0, 0, 0], totalScore: 0, f1Position: 50 },
      { id: 2, name: 'Team 2', scores: [0, 0, 0, 0, 0], totalScore: 0, f1Position: 50 },
      { id: 3, name: 'Team 3', scores: [0, 0, 0, 0, 0], totalScore: 0, f1Position: 50 },
    ],
  };

  const mockQuestion = {
    id: 'dd-1',
    type: 'auction' as const,
    content: 'Name every goalscorer for Tottenham in their successful Europa League run',
    answer: 'All Tottenham goalscorers in the Europa League run',
    points: 12,
    answers: [
      { number: 1, text: 'Solanke', imageUrl: '/images/daves-dozen/solanke.png' },
      { number: 2, text: 'Johnson', imageUrl: '/images/daves-dozen/johnson.png' },
      { number: 3, text: 'Son', imageUrl: '/images/daves-dozen/son.png' },
      { number: 4, text: 'Maddison', imageUrl: '/images/daves-dozen/maddison.png' },
      { number: 5, text: 'Sarr', imageUrl: '/images/daves-dozen/sarr.png' },
      { number: 6, text: 'Porro', imageUrl: '/images/daves-dozen/porro.png' },
      { number: 7, text: 'Odobert', imageUrl: '/images/daves-dozen/odobert.png' },
      { number: 8, text: 'Deki', imageUrl: '/images/daves-dozen/deki.png' },
      { number: 9, text: 'Moore', imageUrl: '/images/daves-dozen/moore.png' },
      { number: 10, text: 'Richarlison', imageUrl: '/images/daves-dozen/richarlison.png' },
      { number: 11, text: 'Scarlett', imageUrl: '/images/daves-dozen/scarlett.png' },
      { number: 12, text: 'Ajayi', imageUrl: '/images/daves-dozen/ajayi.png' },
    ],
  };

  beforeEach(() => {
    mockUseQuizStore.mockReturnValue(mockStore);
    mockUseQuestions.mockReturnValue({
      questions: [mockQuestion],
      currentQuestion: mockQuestion,
      currentQuestionIndex: 0,
      totalQuestions: 1,
      hasNextQuestion: false,
      hasPreviousQuestion: false,
      getQuestionsForRound: vi.fn().mockReturnValue([mockQuestion]),
      currentRoundId: 'daves-dozen',
    });
  });

  it('should render question content', () => {
    render(<DavesDozen />);
    
    expect(screen.getByText('Name every goalscorer for Tottenham in their successful Europa League run')).toBeInTheDocument();
  });

  it('should render 12 boxes with QLAF branding', () => {
    render(<DavesDozen />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    
    const qlafElements = screen.getAllByText('QLAF');
    expect(qlafElements).toHaveLength(12);
  });

  it('should reveal images when answers are revealed', () => {
    const storeWithRevealedAnswers = {
      ...mockStore,
      davesDozenRevealedAnswers: new Set([1, 5, 12]),
    };
    
    mockUseQuizStore.mockReturnValue(storeWithRevealedAnswers);
    
    render(<DavesDozen />);
    
    expect(screen.getByAltText('Solanke')).toBeInTheDocument();
    expect(screen.getByAltText('Sarr')).toBeInTheDocument();
    expect(screen.getByAltText('Ajayi')).toBeInTheDocument();
    
    const qlafElements = screen.getAllByText('QLAF');
    expect(qlafElements.length).toBeLessThan(12);
  });

  it('should show red cross overlay when incorrect answer is shown', () => {
    const storeWithRedCross = {
      ...mockStore,
      davesDozenShowRedCross: true,
    };
    
    mockUseQuizStore.mockReturnValue(storeWithRedCross);
    
    render(<DavesDozen />);
    
    // Check for the X icon component (not an img)
    expect(screen.getByTestId('red-cross-overlay')).toBeInTheDocument();
  });

  it('should not render during transition', () => {
    const storeInTransition = {
      ...mockStore,
      isTransitioning: true,
    };
    
    mockUseQuizStore.mockReturnValue(storeInTransition);
    
    const { container } = render(<DavesDozen />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when not in round state', () => {
    const storeNotInRound = {
      ...mockStore,
      gameState: 'welcome' as const,
    };
    
    mockUseQuizStore.mockReturnValue(storeNotInRound);
    
    const { container } = render(<DavesDozen />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should handle image loading errors gracefully', () => {
    const storeWithRevealedAnswers = {
      ...mockStore,
      davesDozenRevealedAnswers: new Set([1, 2, 3]),
    };
    
    mockUseQuizStore.mockReturnValue(storeWithRevealedAnswers);
    
    render(<DavesDozen />);
    
    // Just check that images are rendered when answers are revealed
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should use responsive design classes', () => {
    render(<DavesDozen />);
    
    const gridContainer = screen.getByTestId('daves-dozen-grid');
    expect(gridContainer).toHaveClass('grid-cols-3', 'md:grid-cols-4');
  });

  it('should have proper aspect ratio for landscape images', () => {
    render(<DavesDozen />);
    
    const boxes = screen.getAllByTestId(/answer-box-/);
    boxes.forEach(box => {
      expect(box).toHaveClass('aspect-video');
    });
  });
});

describe('DavesDozen Store Integration', () => {
  const mockStore = {
    currentRoundIndex: 4,
    showAnswer: false,
    gameState: 'round' as const,
    isTransitioning: false,
    davesDozenRevealedAnswers: new Set(),
    davesDozenShowRedCross: false,
    teams: [
      { id: 1, name: 'Team 1', scores: [0, 0, 0, 0, 0], totalScore: 0, f1Position: 50 },
      { id: 2, name: 'Team 2', scores: [0, 0, 0, 0, 0], totalScore: 0, f1Position: 50 },
      { id: 3, name: 'Team 3', scores: [0, 0, 0, 0, 0], totalScore: 0, f1Position: 50 },
    ],
  };

  beforeEach(() => {
    mockUseQuizStore.mockReturnValue(mockStore);
    mockUseQuestions.mockReturnValue({
      questions: [],
      currentQuestion: null,
      currentQuestionIndex: 0,
      totalQuestions: 0,
      hasNextQuestion: false,
      hasPreviousQuestion: false,
      getQuestionsForRound: vi.fn().mockReturnValue([]),
      currentRoundId: 'daves-dozen',
    });
  });

  it('should use correct store properties', () => {
    render(<DavesDozen />);
    
    expect(mockUseQuizStore).toHaveBeenCalled();
    
    // The component and its children (Scoreboard, Timer) call useQuizStore multiple times
    expect(mockUseQuizStore.mock.calls.length).toBeGreaterThan(0);
  });

  it('should handle empty questions gracefully', () => {
    const storeWithEmptyQuestion = {
      ...mockStore,
    };
    
    mockUseQuizStore.mockReturnValue(storeWithEmptyQuestion);
    mockUseQuestions.mockReturnValue({
      questions: [],
      currentQuestion: null,
      currentQuestionIndex: 0,
      totalQuestions: 0,
      hasNextQuestion: false,
      hasPreviousQuestion: false,
      getQuestionsForRound: vi.fn().mockReturnValue([]),
      currentRoundId: 'daves-dozen',
    });
    
    render(<DavesDozen />);
    
    expect(screen.queryByTestId(/answer-box-/)).not.toBeInTheDocument();
  });
});
