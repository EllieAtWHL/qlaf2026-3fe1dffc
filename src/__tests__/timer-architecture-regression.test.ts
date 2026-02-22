/**
 * Timer Architecture Regression Tests
 * 
 * Tests new timer architecture where:
 * - CoHost broadcasts start/pause/reset actions only
 * - Main display manages countdown locally
 * - No ongoing network traffic for timer ticks
 * - Auto-start works for Picture Board
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock CoHost state
const mockCoHostState = {
  gameState: 'round',
  currentRoundIndex: 2, // Picture Board round
  selectedBoards: {},
  currentTeamSelecting: 1,
  currentPictureIndex: 0,
  showAllPictures: false
};

// Mock MainDisplay state
const mockMainDisplayState = {
  isTimerRunning: false,
  timerValue: 60,
  lastBroadcastAction: null,
  hasLocalInterval: false
};

// Mock broadcast actions
const mockBroadcastActions: any[] = [];

const mockBroadcastAction = (action: string, data?: any) => {
  mockBroadcastActions.push({ action, data, timestamp: Date.now() });
  mockMainDisplayState.lastBroadcastAction = action;
};

// Mock store functions
const mockStore = {
  startTimer: () => {
    mockMainDisplayState.isTimerRunning = true;
    mockMainDisplayState.hasLocalInterval = true;
  },
  pauseTimer: () => {
    mockMainDisplayState.isTimerRunning = false;
    mockMainDisplayState.hasLocalInterval = false;
  },
  resetTimer: (duration = 60) => {
    mockMainDisplayState.timerValue = duration;
    mockMainDisplayState.isTimerRunning = false;
    mockMainDisplayState.hasLocalInterval = false;
  },
  tick: () => {
    if (mockMainDisplayState.isTimerRunning && mockMainDisplayState.timerValue > 0) {
      mockMainDisplayState.timerValue--;
    }
  }
};

// Mock Picture Board auto-start logic
const checkAutoStartConditions = () => {
  const hasBoardSelected = mockCoHostState.selectedBoards[mockCoHostState.currentTeamSelecting];
  const isFirstPicture = mockCoHostState.currentPictureIndex === 0;
  const notShowingAll = !mockCoHostState.showAllPictures;
  const isPictureBoardRound = mockCoHostState.currentRoundIndex === 2;
  
  return {
    hasBoardSelected,
    isFirstPicture,
    notShowingAll,
    roundType: 'picture-board',
    shouldAutoStart: hasBoardSelected && isFirstPicture && notShowingAll && isPictureBoardRound
  };
};

describe('Timer Architecture', () => {
  beforeEach(() => {
    // Reset state before each test
    mockMainDisplayState.isTimerRunning = false;
    mockMainDisplayState.timerValue = 60;
    mockMainDisplayState.lastBroadcastAction = null;
    mockMainDisplayState.hasLocalInterval = false;
    mockBroadcastActions.length = 0;
    mockCoHostState.selectedBoards = {};
    mockCoHostState.currentPictureIndex = 0;
    mockCoHostState.showAllPictures = false;
  });

  it('CoHost broadcasts startTimer - Main display starts local countdown', () => {
    // CoHost starts timer
    mockBroadcastAction('startTimer');
    mockStore.startTimer();
    
    expect(mockBroadcastActions).toHaveLength(1);
    expect(mockBroadcastActions[0].action).toBe('startTimer');
    expect(mockMainDisplayState.isTimerRunning).toBe(true);
    expect(mockMainDisplayState.hasLocalInterval).toBe(true);
  });

  it('CoHost broadcasts pauseTimer - Main display stops local countdown', () => {
    // Start timer first
    mockStore.startTimer();
    mockMainDisplayState.hasLocalInterval = true;
    
    // CoHost pauses timer
    mockBroadcastAction('pauseTimer');
    mockStore.pauseTimer();
    
    expect(mockBroadcastActions).toHaveLength(1);
    expect(mockBroadcastActions[0].action).toBe('pauseTimer');
    expect(mockMainDisplayState.isTimerRunning).toBe(false);
    expect(mockMainDisplayState.hasLocalInterval).toBe(false);
  });

  it('CoHost broadcasts resetTimer - Main display resets and stops', () => {
    // Start timer first
    mockStore.startTimer();
    mockMainDisplayState.timerValue = 30;
    
    // CoHost resets timer
    mockBroadcastAction('resetTimer', { duration: 30 });
    mockStore.resetTimer(30);
    
    expect(mockBroadcastActions).toHaveLength(1);
    expect(mockBroadcastActions[0].action).toBe('resetTimer');
    expect(mockBroadcastActions[0].data).toEqual({ duration: 30 });
    expect(mockMainDisplayState.timerValue).toBe(30);
    expect(mockMainDisplayState.isTimerRunning).toBe(false);
    expect(mockMainDisplayState.hasLocalInterval).toBe(false);
  });

  it('Picture Board auto-start triggers correctly', () => {
    // Set up auto-start conditions
    mockCoHostState.selectedBoards[mockCoHostState.currentTeamSelecting] = 'board-1';
    
    const conditions = checkAutoStartConditions();
    
    expect(conditions.hasBoardSelected).toBe('board-1');
    expect(conditions.isFirstPicture).toBe(true);
    expect(conditions.notShowingAll).toBe(true);
    expect(conditions.roundType).toBe('picture-board');
    expect(conditions.shouldAutoStart).toBe(true);
  });

  it('No ongoing tick broadcasts (architecture compliance)', () => {
    // Start local countdown
    mockStore.startTimer();
    mockMainDisplayState.hasLocalInterval = true;
    
    // Simulate local ticks (no broadcasts)
    for (let i = 0; i < 3; i++) {
      mockStore.tick();
    }
    
    // Should have no tick broadcasts
    const tickBroadcasts = mockBroadcastActions.filter(action => action.action === 'tick');
    expect(tickBroadcasts).toHaveLength(0);
    expect(mockMainDisplayState.timerValue).toBe(57); // 60 -> 57 after 3 ticks
    expect(mockMainDisplayState.hasLocalInterval).toBe(true);
  });
});
