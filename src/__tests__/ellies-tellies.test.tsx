import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
    { id: 'ellies-tellies', name: "Ellie's Tellies", timerDuration: null },
  ],
}));

vi.mock('@/hooks/useQuestions', () => ({
  useQuestions: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import React from 'react';
import { ElliesTellies } from '@/components/rounds/ElliesTellies';
import { useQuizStore } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';

// Get the mocked functions
const mockUseQuizStore = vi.mocked(useQuizStore);
const mockUseQuestions = vi.mocked(useQuestions);

describe('ElliesTellies', () => {
  const mockStore = {
    currentRoundIndex: 6,
    showAnswer: false,
    currentQuestionIndex: 0,
    gameState: 'round',
    isTransitioning: false,
    teams: [
      { id: 'team1', name: 'Team 1', totalScore: 100, roundScores: [] },
      { id: 'team2', name: 'Team 2', totalScore: 80, roundScores: [] },
    ],
  };

  const mockQuestions = {
    questions: [
      {
        id: 'test-1',
        type: 'picture' as const,
        content: 'Test question 1',
        answer: 'Test answer 1',
        points: 10,
        imageUrl: 'https://example.com/test-image-1.jpg',
      },
      {
        id: 'test-2',
        type: 'picture' as const,
        content: 'Test question 2',
        answer: 'Test answer 2',
        points: 10,
        imageUrl: 'https://example.com/test-image-2.jpg',
      },
    ],
    currentQuestion: {
      id: 'test-1',
      type: 'picture' as const,
      content: 'Test question',
      answer: 'Test answer',
      points: 10,
      imageUrl: 'https://example.com/test-image.jpg',
    },
    currentQuestionIndex: 0,
    totalQuestions: 5,
    hasNextQuestion: true,
    hasPreviousQuestion: false,
    currentRoundId: 'ellies-tellies' as const,
    getQuestionsForRound: vi.fn().mockReturnValue([
      {
        id: 'test-1',
        type: 'picture' as const,
        content: 'Test question 1',
        answer: 'Test answer 1',
        points: 10,
        imageUrl: 'https://example.com/test-image-1.jpg',
      },
      {
        id: 'test-2',
        type: 'picture' as const,
        content: 'Test question 2',
        answer: 'Test answer 2',
        points: 10,
        imageUrl: 'https://example.com/test-image-2.jpg',
      },
    ]),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuizStore.mockReturnValue(mockStore);
    mockUseQuestions.mockReturnValue(mockQuestions);
  });

  it('renders the TV frame and screen components', () => {
    render(<ElliesTellies />);
    
    // Check for TV frame image
    const tvFrame = screen.getByAltText('TV Frame');
    expect(tvFrame).toBeInTheDocument();
    expect(tvFrame).toHaveAttribute('src', '/images/ellies-tellies/tvFrame.png');
    
    // Check for question image
    const questionImage = screen.getByAltText('Question Image');
    expect(questionImage).toBeInTheDocument();
    expect(questionImage).toHaveAttribute('src', 'https://example.com/test-image.jpg');
  });

  it('displays question information correctly', () => {
    render(<ElliesTellies />);
    
    expect(screen.getByText('Test question')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
    expect(screen.getByText("Ellie's Tellies")).toBeInTheDocument();
  });

  it('shows loading indicator when image is loading', async () => {
    // Mock a slow-loading image
    const mockImage = new Image();
    const originalImage = global.Image;
    global.Image = vi.fn(() => mockImage) as any;
    
    render(<ElliesTellies />);
    
    // Initially should show loading state
    expect(screen.getByText('Tuning Channel...')).toBeInTheDocument();
    
    // Simulate image load
    fireEvent.load(mockImage);
    
    await waitFor(() => {
      expect(screen.queryByText('Tuning Channel...')).not.toBeInTheDocument();
    });
    
    // Restore original Image constructor
    global.Image = originalImage;
  });

  it('shows error state when image fails to load', async () => {
    // Mock a failing image
    const mockImage = new Image();
    const originalImage = global.Image;
    global.Image = vi.fn(() => mockImage) as any;
    
    render(<ElliesTellies />);
    
    // Simulate image error
    fireEvent.error(mockImage);
    
    await waitFor(() => {
      expect(screen.getByText('Signal Lost')).toBeInTheDocument();
      expect(screen.getByText('Unable to load image')).toBeInTheDocument();
    });
    
    // Restore original Image constructor
    global.Image = originalImage;
  });

  it('does not render when transitioning or not in round state', () => {
    mockUseQuizStore.mockReturnValue({
      ...mockStore,
      gameState: 'menu', // Not in round state
    });

    const { container } = render(<ElliesTellies />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when isTransitioning is true', () => {
    mockUseQuizStore.mockReturnValue({
      ...mockStore,
      isTransitioning: true, // Currently transitioning
    });

    const { container } = render(<ElliesTellies />);
    expect(container.firstChild).toBeNull();
  });

  it('handles missing image URL gracefully', () => {
    mockUseQuestions.mockReturnValue({
      ...mockQuestions,
      currentQuestion: {
        id: 'test-1',
        type: 'picture',
        content: 'Test question',
        answer: 'Test answer',
        points: 10,
        imageUrl: null, // No image URL
      },
    });

    render(<ElliesTellies />);
    
    // Should show placeholder image
    const questionImage = screen.getByAltText('Question Image');
    expect(questionImage).toHaveAttribute('src', '/placeholder.svg');
  });
});
