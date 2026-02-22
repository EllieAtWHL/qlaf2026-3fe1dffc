/**
 * Timer Store Integration Tests
 * 
 * Tests the actual timer store functionality
 * Tests real timer state management and actions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQuizStore } from '@/store/quizStore';

// Mock Howler to avoid actual sound playback in tests
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
  })),
}));

describe('Timer Store Integration', () => {
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

  it('Starts timer correctly', () => {
    const store = useQuizStore.getState();
    
    store.startTimer();
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(true);
    expect(newState.timerValue).toBe(60);
  });

  it('Pauses timer correctly', () => {
    const store = useQuizStore.getState();
    
    // Start timer first
    store.startTimer();
    
    // Then pause it
    store.pauseTimer();
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(false);
    expect(newState.timerValue).toBe(60);
  });

  it('Ticks down correctly when running', () => {
    const store = useQuizStore.getState();
    
    // Start timer
    store.startTimer();
    
    // Tick once
    store.tick();
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(true);
    expect(newState.timerValue).toBe(59);
  });

  it('Stops at zero correctly', () => {
    const store = useQuizStore.getState();
    
    // Set timer to 1 and start
    useQuizStore.setState({ timerValue: 1, isTimerRunning: true });
    
    // Tick (should go to 0 and stop)
    store.tick();
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(false);
    expect(newState.timerValue).toBe(0);
  });

  it('Resets timer correctly', () => {
    const store = useQuizStore.getState();
    
    // Set timer to some value and running
    useQuizStore.setState({ timerValue: 30, isTimerRunning: true });
    
    // Reset timer
    store.resetTimer();
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(false);
    expect(newState.timerValue).toBe(60);
  });

  it('Resets timer with custom duration', () => {
    const store = useQuizStore.getState();
    
    // Reset with custom duration
    store.resetTimer(45);
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(false);
    expect(newState.timerValue).toBe(45);
  });

  it('Does not tick when not running', () => {
    const store = useQuizStore.getState();
    
    // Ensure timer is not running
    useQuizStore.setState({ isTimerRunning: false, timerValue: 30 });
    
    // Try to tick
    store.tick();
    
    const newState = useQuizStore.getState();
    expect(newState.isTimerRunning).toBe(false);
    expect(newState.timerValue).toBe(30); // Should not change
  });

  it('Does not tick below zero', () => {
    const store = useQuizStore.getState();
    
    // Set timer to 0 and running
    useQuizStore.setState({ isTimerRunning: true, timerValue: 0 });
    
    // Try to tick
    store.tick();
    
    const newState = useQuizStore.getState();
    expect(newState.timerValue).toBe(0); // Should not go below 0
  });
});
