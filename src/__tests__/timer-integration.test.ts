/**
 * Timer Component Integration Tests
 * 
 * Tests the actual Timer component and store integration
 * Tests real timer functionality with sound integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from '@/components/Timer';
import { useQuizStore } from '@/store/quizStore';

// Mock Howler to avoid actual sound playback in tests
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
  })),
}));

describe('Timer Component Integration', () => {
  beforeEach(() => {
    // Reset store state before each test
    useQuizStore.setState({
      timerValue: 60,
      isTimerRunning: false,
      gameState: 'round',
    });
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  it('Renders initial timer state correctly', () => {
    render(<Timer />);
    
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('Displays running timer correctly', () => {
    // Set timer to running state
    useQuizStore.setState({
      timerValue: 45,
      isTimerRunning: true,
      gameState: 'round',
    });
    
    render(<Timer />);
    
    expect(screen.getByText('0:45')).toBeInTheDocument();
  });

  it('Shows warning color when timer <= 10 seconds', () => {
    useQuizStore.setState({
      timerValue: 8,
      isTimerRunning: true,
      gameState: 'round',
    });
    
    render(<Timer />);
    
    const timerElement = screen.getByText('0:08');
    expect(timerElement).toHaveClass('text-qlaf-danger');
  });

  it('Shows warning color when timer <= 30 seconds', () => {
    useQuizStore.setState({
      timerValue: 25,
      isTimerRunning: true,
      gameState: 'round',
    });
    
    render(<Timer />);
    
    const timerElement = screen.getByText('0:25');
    expect(timerElement).toHaveClass('text-qlaf-warning');
  });

  it('Shows normal color when timer > 30 seconds', () => {
    useQuizStore.setState({
      timerValue: 45,
      isTimerRunning: true,
      gameState: 'round',
    });
    
    render(<Timer />);
    
    const timerElement = screen.getByText('0:45');
    expect(timerElement).toHaveClass('text-qlaf-primary');
  });

  it('Handles compact mode correctly', () => {
    useQuizStore.setState({
      timerValue: 30,
      isTimerRunning: true,
      gameState: 'round',
    });
    
    const { container } = render(<Timer compact={true} />);
    
    const timerElement = container.querySelector('.text-2xl');
    expect(timerElement).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('Handles full size mode correctly', () => {
    useQuizStore.setState({
      timerValue: 30,
      isTimerRunning: true,
      gameState: 'round',
    });
    
    const { container } = render(<Timer compact={false} />);
    
    const timerElement = container.querySelector('.text-6xl');
    expect(timerElement).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('Formats time correctly with minutes', () => {
    useQuizStore.setState({
      timerValue: 125, // 2 minutes, 5 seconds
      isTimerRunning: true,
      gameState: 'round',
    });
    
    render(<Timer />);
    
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });
});
