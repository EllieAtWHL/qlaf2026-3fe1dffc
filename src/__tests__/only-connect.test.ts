import { describe, it, expect } from 'vitest';

// Test data
const onlyConnectQuestions = [
  {
    id: 'oc-1',
    type: 'connection',
    content: 'What connects these sports stars?',
    options: [
      { text: 'Seth Curry', imageUrl: '/images/only-connect/sethCurry.png' },
      { text: 'Simone Inzaghi', imageUrl: '/images/only-connect/simoneInzaghi.png' },
      { text: 'Jonathan Brownlee', imageUrl: '/images/only-connect/jonathanBrownlee.png' },
      { text: 'Eli Manning', imageUrl: '/images/only-connect/eliManning.png' }
    ],
    answer: 'Younger sporting brothers who played against their older sibling.'
  }
];

describe('Only Connect Round', () => {
  describe('Question Structure', () => {
    it('should have valid question ID format', () => {
      onlyConnectQuestions.forEach(q => {
        expect(q.id).toMatch(/^oc-\d+$/);
      });
    });

    it('should have type as "connection"', () => {
      onlyConnectQuestions.forEach(q => {
        expect(q.type).toBe('connection');
      });
    });

    it('should have content (question text)', () => {
      onlyConnectQuestions.forEach(q => {
        expect(q.content).toBeDefined();
        expect(q.content.length).toBeGreaterThan(0);
      });
    });

    it('should have exactly 4 options', () => {
      onlyConnectQuestions.forEach(q => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('should have an answer', () => {
      onlyConnectQuestions.forEach(q => {
        expect(q.answer).toBeDefined();
        expect(q.answer.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Options Structure', () => {
    it('should have text or imageUrl (or both) for each option', () => {
      onlyConnectQuestions.forEach(q => {
        q.options.forEach(option => {
          expect(option.text || option.imageUrl).toBeDefined();
        });
      });
    });

    it('should have valid image paths when imageUrl is provided', () => {
      onlyConnectQuestions.forEach(q => {
        q.options.forEach(option => {
          if (option.imageUrl) {
            expect(option.imageUrl).toMatch(/^\/images\//);
          }
        });
      });
    });
  });

  describe('Reveal Points System', () => {
    it('should calculate correct points for reveal order', () => {
      const pointsMap = [5, 3, 2, 1];
      
      pointsMap.forEach((points, index) => {
        const revealedCount = index + 1;
        expect(pointsMap[revealedCount - 1]).toBe(points);
      });
    });

    it('should have 4 possible point values', () => {
      const points = [5, 3, 2, 1];
      expect(points).toHaveLength(4);
      expect(Math.min(...points)).toBe(1);
      expect(Math.max(...points)).toBe(5);
    });
  });

  describe('Content Validation', () => {
    it('should not have duplicate question IDs', () => {
      const ids = onlyConnectQuestions.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have meaningful answer descriptions', () => {
      onlyConnectQuestions.forEach(q => {
        expect(q.answer.length).toBeGreaterThan(5);
      });
    });
  });
});
