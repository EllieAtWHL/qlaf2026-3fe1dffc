import { describe, it, expect, beforeEach } from 'vitest';

// Mock the ChrisStadia component logic
const createChrisStadiaLogic = () => {
  let showAnswer = false;
  let revealedCards: number[] = [];
  let watchRevealed: number[] = [];
  let watchShownOnScreen: number[] = [];

  const isRevealed = (cardId: number) => revealedCards.includes(cardId);
  const isWatchReasonRevealed = (cardId: number) => watchRevealed.includes(cardId);
  const isWatchReasonShownOnScreen = (cardId: number) => watchShownOnScreen.includes(cardId);
  
  const shouldShowReason = (card: { visitType: string; id: number }) => {
    return showAnswer || (card.visitType === 'watch' && isWatchReasonShownOnScreen(card.id));
  };

  const setShowAnswer = (value: boolean) => {
    showAnswer = value;
  };

  const setRevealedCards = (cards: number[]) => {
    revealedCards = cards;
  };

  const setWatchRevealed = (cardIds: number[]) => {
    watchRevealed = cardIds;
  };

  const setWatchShownOnScreen = (cardIds: number[]) => {
    watchShownOnScreen = cardIds;
  };

  return {
    isRevealed,
    isWatchReasonRevealed,
    isWatchReasonShownOnScreen,
    shouldShowReason,
    setShowAnswer,
    setRevealedCards,
    setWatchRevealed,
    setWatchShownOnScreen,
    getState: () => ({
      showAnswer,
      revealedCards,
      watchRevealed,
      watchShownOnScreen
    })
  };
};

describe('Chris Stadia Component Logic - Automated Tests', () => {
  let logic: ReturnType<typeof createChrisStadiaLogic>;

  beforeEach(() => {
    logic = createChrisStadiaLogic();
  });

  describe('Card Reveal Logic', () => {
    it('should correctly identify revealed cards', () => {
      logic.setRevealedCards([1, 3, 5]);
      
      expect(logic.isRevealed(1)).toBe(true);
      expect(logic.isRevealed(3)).toBe(true);
      expect(logic.isRevealed(5)).toBe(true);
      expect(logic.isRevealed(2)).toBe(false);
      expect(logic.isRevealed(4)).toBe(false);
    });

    it('should handle empty revealed cards', () => {
      expect(logic.isRevealed(1)).toBe(false);
      expect(logic.isRevealed(999)).toBe(false);
    });
  });

  describe('Watch Reason Logic', () => {
    it('should correctly identify watch reason revealed cards', () => {
      logic.setWatchRevealed([1, 3]);
      
      expect(logic.isWatchReasonRevealed(1)).toBe(true);
      expect(logic.isWatchReasonRevealed(3)).toBe(true);
      expect(logic.isWatchReasonRevealed(2)).toBe(false);
      expect(logic.isWatchReasonRevealed(4)).toBe(false);
    });

    it('should correctly identify watch reason shown on screen cards', () => {
      logic.setWatchShownOnScreen([1]);
      
      expect(logic.isWatchReasonShownOnScreen(1)).toBe(true);
      expect(logic.isWatchReasonShownOnScreen(2)).toBe(false);
      expect(logic.isWatchReasonShownOnScreen(3)).toBe(false);
    });
  });

  describe('Should Show Reason Logic', () => {
    it('should show reasons when showAnswer is true', () => {
      logic.setShowAnswer(true);
      
      const watchCard = { visitType: 'watch', id: 1 };
      const workCard = { visitType: 'work', id: 2 };
      const notVisitedCard = { visitType: 'not_visited', id: 3 };
      
      expect(logic.shouldShowReason(watchCard)).toBe(true);
      expect(logic.shouldShowReason(workCard)).toBe(true);
      expect(logic.shouldShowReason(notVisitedCard)).toBe(true);
    });

    it('should show reasons for watch cards when shown on screen', () => {
      logic.setShowAnswer(false);
      logic.setWatchShownOnScreen([1, 3]);
      
      const watchCardShown = { visitType: 'watch', id: 1 };
      const watchCardNotShown = { visitType: 'watch', id: 2 };
      const workCard = { visitType: 'work', id: 3 };
      
      expect(logic.shouldShowReason(watchCardShown)).toBe(true);
      expect(logic.shouldShowReason(watchCardNotShown)).toBe(false);
      expect(logic.shouldShowReason(workCard)).toBe(false);
    });

    it('should not show reasons when showAnswer is false and not shown on screen', () => {
      logic.setShowAnswer(false);
      logic.setWatchShownOnScreen([]);
      
      const watchCard = { visitType: 'watch', id: 1 };
      const workCard = { visitType: 'work', id: 2 };
      
      expect(logic.shouldShowReason(watchCard)).toBe(false);
      expect(logic.shouldShowReason(workCard)).toBe(false);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle mixed card types with different states', () => {
      // Setup: Multiple cards with different states
      logic.setRevealedCards([1, 2, 3, 4]);
      logic.setWatchRevealed([1, 3]);
      logic.setWatchShownOnScreen([1]);
      logic.setShowAnswer(false);
      
      const watchCardShown = { visitType: 'watch', id: 1 };
      const watchCardNotShown = { visitType: 'watch', id: 3 };
      const workCard = { visitType: 'work', id: 2 };
      const notVisitedCard = { visitType: 'not_visited', id: 4 };
      
      expect(logic.shouldShowReason(watchCardShown)).toBe(true); // Shown on screen
      expect(logic.shouldShowReason(watchCardNotShown)).toBe(false); // Not shown on screen
      expect(logic.shouldShowReason(workCard)).toBe(false); // Not watch card
      expect(logic.shouldShowReason(notVisitedCard)).toBe(false); // Not watch card
    });

    it('should handle showAnswer toggle correctly', () => {
      const watchCard = { visitType: 'watch', id: 1 };
      const workCard = { visitType: 'work', id: 2 };
      
      // Initial: showAnswer false, not shown on screen
      logic.setShowAnswer(false);
      logic.setWatchShownOnScreen([]);
      
      expect(logic.shouldShowReason(watchCard)).toBe(false);
      expect(logic.shouldShowReason(workCard)).toBe(false);
      
      // Toggle showAnswer true
      logic.setShowAnswer(true);
      
      expect(logic.shouldShowReason(watchCard)).toBe(true);
      expect(logic.shouldShowReason(workCard)).toBe(true);
      
      // Toggle showAnswer false again
      logic.setShowAnswer(false);
      
      expect(logic.shouldShowReason(watchCard)).toBe(false);
      expect(logic.shouldShowReason(workCard)).toBe(false);
    });

    it('should maintain watch card reasons when showAnswer resets', () => {
      const watchCard = { visitType: 'watch', id: 1 };
      const workCard = { visitType: 'work', id: 2 };
      
      // Setup: Watch card shown on screen
      logic.setWatchShownOnScreen([1]);
      logic.setShowAnswer(true);
      
      expect(logic.shouldShowReason(watchCard)).toBe(true);
      expect(logic.shouldShowReason(workCard)).toBe(true);
      
      // Reset showAnswer (simulate new card click)
      logic.setShowAnswer(false);
      
      // Watch card should still show reason because it's in watchShownOnScreen
      expect(logic.shouldShowReason(watchCard)).toBe(true);
      expect(logic.shouldShowReason(workCard)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown visit types', () => {
      logic.setShowAnswer(false);
      logic.setWatchShownOnScreen([1]);
      
      const unknownCard = { visitType: 'unknown', id: 1 };
      
      expect(logic.shouldShowReason(unknownCard)).toBe(false);
    });

    it('should handle empty states', () => {
      const watchCard = { visitType: 'watch', id: 1 };
      
      logic.setShowAnswer(false);
      logic.setWatchShownOnScreen([]);
      
      expect(logic.shouldShowReason(watchCard)).toBe(false);
    });

    it('should handle large card numbers', () => {
      const largeCardIds = Array.from({ length: 100 }, (_, i) => i + 1);
      
      logic.setRevealedCards(largeCardIds);
      logic.setWatchRevealed(largeCardIds.filter(i => i % 2 === 1));
      logic.setWatchShownOnScreen(largeCardIds.filter(i => i % 3 === 0));
      
      // Test a few specific cards
      expect(logic.isRevealed(1)).toBe(true);
      expect(logic.isRevealed(100)).toBe(true);
      expect(logic.isWatchReasonRevealed(1)).toBe(true); // Odd number
      expect(logic.isWatchReasonRevealed(2)).toBe(false); // Even number
      expect(logic.isWatchReasonShownOnScreen(3)).toBe(true); // Divisible by 3
      expect(logic.isWatchReasonShownOnScreen(4)).toBe(false); // Not divisible by 3
    });
  });

  describe('State Transitions', () => {
    it('should handle complete workflow', () => {
      const watchCard1 = { visitType: 'watch', id: 1 };
      const watchCard2 = { visitType: 'watch', id: 2 };
      const workCard = { visitType: 'work', id: 3 };
      
      // Step 1: Click watch card
      logic.setRevealedCards([1]);
      logic.setWatchRevealed([1]);
      logic.setShowAnswer(false);
      
      expect(logic.shouldShowReason(watchCard1)).toBe(false); // Not shown on screen yet
      
      // Step 2: Show on screen
      logic.setWatchShownOnScreen([1]);
      
      expect(logic.shouldShowReason(watchCard1)).toBe(true); // Now shown on screen
      
      // Step 3: Click different card (non-watch)
      logic.setRevealedCards([1, 3]);
      logic.setWatchRevealed([]); // Clear for non-watch
      logic.setShowAnswer(false); // Reset showAnswer
      
      expect(logic.shouldShowReason(watchCard1)).toBe(true); // Still shown on screen
      expect(logic.shouldShowReason(workCard)).toBe(false); // Not watch card
      
      // Step 4: Click another watch card
      logic.setRevealedCards([1, 2, 3]);
      logic.setWatchRevealed([2]); // Only new watch card
      logic.setShowAnswer(false);
      
      expect(logic.shouldShowReason(watchCard1)).toBe(true); // Still shown on screen
      expect(logic.shouldShowReason(watchCard2)).toBe(false); // Not shown on screen yet
      expect(logic.shouldShowReason(workCard)).toBe(false); // Not watch card
    });
  });
});
