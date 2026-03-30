import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizStore } from '../quizStore';

describe('Chris Stadia State Management', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useQuizStore.getState();
    store.resetGame();
  });

  describe('Initial State', () => {
    it('has correct initial Chris Stadia state', () => {
      const store = useQuizStore.getState();
      
      expect(store.chrisStadiaRevealedCards).toEqual([]);
      expect(store.chrisStadiaWatchRevealed).toEqual([]);
      expect(store.chrisStadiaWatchShownOnScreen).toEqual([]);
    });
  });

  describe('Reset Behavior', () => {
    it('clears revealed cards when reset', () => {
      const store = useQuizStore.getState();
      
      store.setChrisStadiaRevealedCards([1, 3, 5]);
      store.resetChrisStadia();
      
      expect(store.chrisStadiaRevealedCards).toEqual([]);
    });

    it('clears watch reasons when set to empty array', () => {
      const store = useQuizStore.getState();
      
      store.setChrisStadiaWatchRevealed([1, 3]);
      store.setChrisStadiaWatchRevealed([]);
      
      expect(store.chrisStadiaWatchRevealed).toEqual([]);
    });

    it('clears shown on screen when set to empty array', () => {
      const store = useQuizStore.getState();
      
      store.setChrisStadiaWatchShownOnScreen([1, 3]);
      store.setChrisStadiaWatchShownOnScreen([]);
      
      expect(store.chrisStadiaWatchShownOnScreen).toEqual([]);
    });

    it('resets all Chris Stadia state together', () => {
      const store = useQuizStore.getState();
      
      // Set up complex state
      store.setChrisStadiaRevealedCards([1, 2, 3]);
      store.setChrisStadiaWatchRevealed([1, 3]);
      store.setChrisStadiaWatchShownOnScreen([1]);
      
      // Reset
      store.resetChrisStadia();
      
      expect(store.chrisStadiaRevealedCards).toEqual([]);
      expect(store.chrisStadiaWatchRevealed).toEqual([]);
      expect(store.chrisStadiaWatchShownOnScreen).toEqual([]);
    });

    it('resets all Chris Stadia state in full game reset', () => {
      const store = useQuizStore.getState();
      
      // Set up complex state
      store.setChrisStadiaRevealedCards([1, 2, 3]);
      store.setChrisStadiaWatchRevealed([1, 3]);
      store.setChrisStadiaWatchShownOnScreen([1]);
      
      // Full game reset
      store.resetGame();
      
      expect(store.chrisStadiaRevealedCards).toEqual([]);
      expect(store.chrisStadiaWatchRevealed).toEqual([]);
      expect(store.chrisStadiaWatchShownOnScreen).toEqual([]);
    });
  });
});
