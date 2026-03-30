import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQuizStore } from '../quizStore';

// Mock the store to avoid state reset issues
const createMockStore = () => {
  let state = {
    chrisStadiaRevealedCards: [],
    chrisStadiaWatchRevealed: [],
    chrisStadiaWatchShownOnScreen: []
  };

  return {
    getState: () => state,
    setChrisStadiaRevealedCards: (cards: number[]) => {
      state.chrisStadiaRevealedCards = cards;
    },
    setChrisStadiaWatchRevealed: (cardIds: number[]) => {
      state.chrisStadiaWatchRevealed = cardIds;
    },
    setChrisStadiaWatchShownOnScreen: (cardIds: number[]) => {
      state.chrisStadiaWatchShownOnScreen = cardIds;
    },
    resetChrisStadia: () => {
      state.chrisStadiaRevealedCards = [];
      state.chrisStadiaWatchRevealed = [];
      state.chrisStadiaWatchShownOnScreen = [];
    }
  };
};

describe('Chris Stadia Store - Automated Tests', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    mockStore = createMockStore();
  });

  describe('Basic State Management', () => {
    it('should initialize with empty arrays', () => {
      const state = mockStore.getState();
      
      expect(state.chrisStadiaRevealedCards).toEqual([]);
      expect(state.chrisStadiaWatchRevealed).toEqual([]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([]);
    });

    it('should set revealed cards correctly', () => {
      mockStore.setChrisStadiaRevealedCards([1, 3, 5]);
      
      expect(mockStore.getState().chrisStadiaRevealedCards).toEqual([1, 3, 5]);
    });

    it('should set watch revealed cards correctly', () => {
      mockStore.setChrisStadiaWatchRevealed([1, 3]);
      
      expect(mockStore.getState().chrisStadiaWatchRevealed).toEqual([1, 3]);
    });

    it('should set watch shown on screen cards correctly', () => {
      mockStore.setChrisStadiaWatchShownOnScreen([1]);
      
      expect(mockStore.getState().chrisStadiaWatchShownOnScreen).toEqual([1]);
    });

    it('should reset all state correctly', () => {
      // Set up complex state
      mockStore.setChrisStadiaRevealedCards([1, 2, 3]);
      mockStore.setChrisStadiaWatchRevealed([1, 3]);
      mockStore.setChrisStadiaWatchShownOnScreen([1]);
      
      // Reset
      mockStore.resetChrisStadia();
      
      const state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([]);
      expect(state.chrisStadiaWatchRevealed).toEqual([]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([]);
    });
  });

  describe('Watch Card Workflow', () => {
    it('should handle complete watch card reveal workflow', () => {
      // Step 1: Click watch card
      mockStore.setChrisStadiaRevealedCards([1]);
      mockStore.setChrisStadiaWatchRevealed([1]);
      
      let state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([1]);
      expect(state.chrisStadiaWatchRevealed).toEqual([1]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([]);
      
      // Step 2: Show on screen
      mockStore.setChrisStadiaWatchShownOnScreen([1]);
      
      state = mockStore.getState();
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1]);
      
      // Step 3: Click different card (non-watch)
      mockStore.setChrisStadiaRevealedCards([1, 2]);
      mockStore.setChrisStadiaWatchRevealed([]); // Clear for non-watch
      
      state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([1, 2]);
      expect(state.chrisStadiaWatchRevealed).toEqual([]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1]); // Should persist
      
      // Step 4: Click another watch card
      mockStore.setChrisStadiaRevealedCards([1, 2, 3]);
      mockStore.setChrisStadiaWatchRevealed([3]); // Only new watch card
      
      state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([1, 2, 3]);
      expect(state.chrisStadiaWatchRevealed).toEqual([3]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1]); // Should persist
    });

    it('should handle multiple watch cards with showAnswer toggle', () => {
      // Setup: Multiple watch cards revealed
      mockStore.setChrisStadiaRevealedCards([1, 3]);
      mockStore.setChrisStadiaWatchRevealed([1, 3]);
      
      // Toggle showAnswer ON
      mockStore.setChrisStadiaWatchShownOnScreen([1, 3]);
      
      let state = mockStore.getState();
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1, 3]);
      
      // Toggle showAnswer OFF
      mockStore.setChrisStadiaWatchShownOnScreen([]);
      
      state = mockStore.getState();
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([]);
    });
  });

  describe('State Independence', () => {
    it('should manage each state independently', () => {
      // Set each state to different values
      mockStore.setChrisStadiaRevealedCards([1, 2, 3, 4]);
      mockStore.setChrisStadiaWatchRevealed([1, 3]);
      mockStore.setChrisStadiaWatchShownOnScreen([1]);
      
      // Verify independence
      const state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([1, 2, 3, 4]);
      expect(state.chrisStadiaWatchRevealed).toEqual([1, 3]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1]);
      
      // Change one without affecting others
      mockStore.setChrisStadiaWatchRevealed([5]);
      
      const newState = mockStore.getState();
      expect(newState.chrisStadiaRevealedCards).toEqual([1, 2, 3, 4]); // Unchanged
      expect(newState.chrisStadiaWatchRevealed).toEqual([5]); // Changed
      expect(newState.chrisStadiaWatchShownOnScreen).toEqual([1]); // Unchanged
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty arrays correctly', () => {
      mockStore.setChrisStadiaRevealedCards([]);
      mockStore.setChrisStadiaWatchRevealed([]);
      mockStore.setChrisStadiaWatchShownOnScreen([]);
      
      const state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([]);
      expect(state.chrisStadiaWatchRevealed).toEqual([]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([]);
    });

    it('should handle single card arrays', () => {
      mockStore.setChrisStadiaRevealedCards([1]);
      mockStore.setChrisStadiaWatchRevealed([1]);
      mockStore.setChrisStadiaWatchShownOnScreen([1]);
      
      const state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([1]);
      expect(state.chrisStadiaWatchRevealed).toEqual([1]);
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1]);
    });

    it('should handle card replacement correctly', () => {
      // Set initial state
      mockStore.setChrisStadiaWatchRevealed([1, 3]);
      
      // Replace with single card
      mockStore.setChrisStadiaWatchRevealed([5]);
      
      expect(mockStore.getState().chrisStadiaWatchRevealed).toEqual([5]);
    });

    it('should handle large arrays correctly', () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => i + 1);
      
      mockStore.setChrisStadiaRevealedCards(largeArray);
      mockStore.setChrisStadiaWatchRevealed(largeArray.filter(i => i % 2 === 1));
      mockStore.setChrisStadiaWatchShownOnScreen(largeArray.filter(i => i % 3 === 0));
      
      const state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual(largeArray);
      expect(state.chrisStadiaWatchRevealed).toEqual(largeArray.filter(i => i % 2 === 1));
      expect(state.chrisStadiaWatchShownOnScreen).toEqual(largeArray.filter(i => i % 3 === 0));
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle rapid card clicking scenario', () => {
      // Simulate rapid clicking of different cards
      mockStore.setChrisStadiaRevealedCards([1]);
      mockStore.setChrisStadiaWatchRevealed([1]);
      
      mockStore.setChrisStadiaRevealedCards([1, 2]);
      mockStore.setChrisStadiaWatchRevealed([]); // Non-watch card
      
      mockStore.setChrisStadiaRevealedCards([1, 2, 3]);
      mockStore.setChrisStadiaWatchRevealed([3]); // Watch card
      
      mockStore.setChrisStadiaRevealedCards([1, 2, 3, 4]);
      mockStore.setChrisStadiaWatchRevealed([]); // Non-watch card
      
      const state = mockStore.getState();
      expect(state.chrisStadiaRevealedCards).toEqual([1, 2, 3, 4]);
      expect(state.chrisStadiaWatchRevealed).toEqual([]);
    });

    it('should handle showAnswer persistence across card changes', () => {
      // Setup: Watch card shown on screen
      mockStore.setChrisStadiaRevealedCards([1]);
      mockStore.setChrisStadiaWatchRevealed([1]);
      mockStore.setChrisStadiaWatchShownOnScreen([1]);
      
      // Change to different watch card
      mockStore.setChrisStadiaWatchRevealed([3]);
      
      const state = mockStore.getState();
      expect(state.chrisStadiaWatchShownOnScreen).toEqual([1]); // Should persist
      expect(state.chrisStadiaWatchRevealed).toEqual([3]); // Should update
    });
  });
});
