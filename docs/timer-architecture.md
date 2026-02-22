# Timer Architecture Documentation

## Overview

The QLAF 2026 quiz application uses a sophisticated timer architecture that balances performance, synchronization, and user experience. The timer system is designed to provide reliable countdown functionality while minimizing network traffic and maintaining architectural integrity.

## 🏗️ Architecture Principles

### 1. Single Broadcast Source
- **CoHostInterface**: Only component that broadcasts timer control actions
- **MainDisplay**: Receives broadcasts and manages local countdown
- **Timer Component**: Handles local countdown logic and UI

### 2. Local Countdown Management
- Timer countdown is managed locally on the main display
- No ongoing network traffic during countdown
- Reliable performance regardless of network conditions

### 3. Control Action Broadcasting
- Only control actions (start/pause/reset) are broadcast
- No per-second tick broadcasting
- Minimal network overhead

## 🔄 Data Flow

```
CoHostInterface → broadcastAction('startTimer') → Supabase → 
useQuizSync → MainDisplay → setInterval(local countdown) → Timer UI
```

**Key Characteristics:**
- One-time broadcast for control actions
- Local setInterval for countdown
- No ongoing network traffic during countdown

## 📱 Component Responsibilities

### CoHostInterface.tsx
```typescript
// Broadcasts control actions only
const syncedStartTimer = () => {
  startTimer();
  broadcastAction('startTimer');
};

// Auto-start for Picture Board
useEffect(() => {
  if (ROUNDS[currentRoundIndex]?.id === 'picture-board') {
    // Auto-start logic with debouncing
    if (hasBoardSelected && isFirstPicture && notShowingAll) {
      startTimer();
      broadcastAction('startTimer');
    }
  }
}, [dependencies]);
```

**Responsibilities:**
- Broadcast timer control actions (start/pause/reset)
- Auto-start timer for Picture Board rounds
- No timer UI controls (clean interface)
- No ongoing broadcasting

### MainDisplay.tsx
```typescript
// Receives broadcasts and updates local state
// Timer component handles local countdown
<Timer compact={false} />
```

**Responsibilities:**
- Receive timer control broadcasts
- Display timer UI
- No broadcasting logic

### Timer.tsx
```typescript
// Local countdown management
useEffect(() => {
  let interval: NodeJS.Timeout | null = null;
  
  if (isTimerRunning && timerValue > 0) {
    interval = setInterval(() => {
      tick();
    }, 1000);
  }

  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [isTimerRunning, timerValue, tick]);
```

**Responsibilities:**
- Manage local countdown with setInterval
- Handle local sound effects (tick, warning, time-up)
- Update visual display
- No network communication

### useQuizSync.ts
```typescript
// Handle timer control broadcasts
case 'startTimer':
  useQuizStore.setState({ isTimerRunning: true });
  break;
case 'pauseTimer':
  useQuizStore.setState({ isTimerRunning: false });
  break;
case 'resetTimer':
  useQuizStore.setState({ 
    timerValue: data?.duration ?? 60, 
    isTimerRunning: false 
  });
  break;
// Note: No 'tick' case - countdown is local
```

**Responsibilities:**
- Receive and distribute timer control actions
- No tick broadcasting
- State synchronization only

## 🎯 Use Cases

### 1. Picture Board Auto-Start
```typescript
// CoHost detects Picture Board conditions
if (selectedBoards[currentTeamSelecting] && 
    currentPictureIndex === 0 && 
    !showAllPictures) {
  startTimer();
  broadcastAction('startTimer');
}
```

**Flow:**
1. Team selects board
2. First picture displays
3. CoHost broadcasts startTimer
4. Main display receives and starts local countdown
5. Timer appears on main display

### 2. Manual Timer Control
```typescript
// CoHost broadcasts control action
const syncedPauseTimer = () => {
  pauseTimer();
  broadcastAction('pauseTimer');
};
```

**Flow:**
1. CoHost triggers control action
2. Action broadcast to main display
3. Main display updates local timer state
4. Countdown continues/stops locally

### 3. Timer Reset
```typescript
// CoHost broadcasts reset with duration
const syncedResetTimer = (duration?: number) => {
  resetTimer(duration);
  broadcastAction('resetTimer', { duration });
};
```

**Flow:**
1. CoHost triggers reset
2. Duration included in broadcast
3. Main display resets to specified duration
4. Local countdown stops

## ⚡ Performance Benefits

### Network Traffic Reduction
- **Before**: 1 broadcast per second during countdown
- **After**: 1 broadcast per control action only
- **Reduction**: ~99% less timer-related network traffic

### Reliability Improvements
- **Local Countdown**: Not dependent on network conditions
- **No Sync Issues**: No double-ticking or race conditions
- **Consistent Performance**: Same speed regardless of network

### Architecture Compliance
- **Single Source**: Only CoHostInterface broadcasts timer actions
- **Clean Separation**: Each component has clear responsibilities
- **No Conflicts**: No multiple broadcast sources

## 🧪 Testing Strategy

### Unit Tests
```bash
# Run timer functionality tests
npm test timer-functionality.test.ts

# Run architecture regression tests  
npm test timer-architecture-regression.test.ts

# Run store integration tests
npm test timer-store-integration.test.ts
```

### Integration Tests
```bash
# Run all tests (unified Vitest structure)
npm test
# or use jest alias
npm jest

# Run specific test categories
npm test -- --grep "Timer"
npm test -- --grep "Architecture"
npm test -- --grep "Integration"
```

### Test Coverage
- **Timer Logic**: Start, tick, pause, stop, reset functionality
- **Store Integration**: Real state management and actions
- **Component Rendering**: Timer display and color changes
- **Architecture Compliance**: CoHost broadcasts, MainDisplay local countdown
- **Auto-start Logic**: Picture Board timer initialization
- **Sound Integration**: Howler.js sound playback with local files

## 📊 Performance Tests
- Measure network traffic during countdown
- Test with slow network conditions
- Verify local countdown reliability
- Check memory usage

## 🚨 Critical Fixes Applied

**Infinite Loop Prevention:**
- Added `!isTimerRunning` guard in auto-start logic to prevent infinite timer start loops
- Fixed missing `isTimerRunning` variable in CoHostInterface destructuring
- Timer now starts only once when conditions are met and timer is not already running

**Enhanced Test Suite:**
- Moved from Node.js tests to unified Vitest structure
- Added real store integration tests (`timer-store-integration.test.ts`)
- All tests now run with `npm test` or `npm jest`
- Tests cover actual component rendering and store state management

## 🔧 Development Guidelines

### Adding Timer Features
1. **Control Actions**: Add to CoHostInterface broadcasting
2. **Local Logic**: Implement in Timer component
3. **State Management**: Update useQuizStore
4. **Sync Handling**: Add to useQuizSync (no tick actions)

### Architecture Rules
- ✅ CoHostInterface broadcasts timer control actions
- ✅ MainDisplay manages local countdown
- ✅ Timer component handles local logic
- ❌ No tick broadcasting
- ❌ No multiple broadcast sources
- ❌ No timer controls on CoHost UI

### Code Review Checklist
- [ ] Timer control actions in CoHostInterface only
- [ ] Local countdown in Timer component
- [ ] No ongoing network traffic during countdown
- [ ] Picture Board auto-start works
- [ ] Architecture compliance maintained

## 🐛 Common Issues & Solutions

### Issue: Timer Not Starting
**Cause**: Auto-start conditions not met
**Solution**: Check Picture Board state and board selection
**Debug**: Log auto-start conditions

### Issue: Timer Running Too Fast
**Cause**: Multiple intervals or broadcast sources
**Solution**: Ensure only one local interval
**Debug**: Check for multiple useEffect hooks

### Issue: Timer Not Syncing
**Cause**: Broadcast not received
**Solution**: Verify network connection and sync status
**Debug**: Check broadcast action logs

### Issue: Navigation Affecting Timer
**Cause**: Timer broadcasting on navigation
**Solution**: Remove timer broadcasting from navigation
**Debug**: Check navigation functions for timer calls

## 📚 Related Documentation

- [Sync Architecture Guide](sync-architecture.md) - Overall sync system
- [Co-Host Interface Guide](co-host-interface.md) - CoHost usage
- [Picture Board Investigation](picture-board-delay-investigation.md) - Performance fixes
- [Testing Guide](testing-guide.md) - Testing procedures

## 🚀 Future Enhancements

### Potential Improvements
1. **Timer Presets**: Quick duration presets for different round types
2. **Visual Indicators**: Better visual feedback for timer states
3. **Sound Customization**: Local sound effects with configurable volume
4. **Timer History**: Track timer usage patterns
5. **Mobile Controls**: Touch-optimized timer controls if needed

### Architecture Considerations
- Maintain single broadcast source principle
- Keep local countdown for performance
- Preserve clean CoHost interface
- Ensure backward compatibility

---

*This documentation covers the complete timer architecture implementation, from high-level principles to specific implementation details. It serves as a reference for developers working with timer functionality and ensures architectural consistency across the application.*
