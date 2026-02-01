# Picture Board Sync Investigation

## 🎯 Objective
Fix Picture Board round synchronization where main app receives co-host broadcasts for team transitions and board selection.

## 🔍 Problem Summary
The Picture Board round works perfectly for individual picture navigation, but the sync channel closes during team transitions, preventing the main app from receiving `selectBoard` broadcasts for subsequent teams.

## 📋 Attempts Made

### Attempt 1: PictureBoard Component Sync
**Approach:** Put `useQuizSync` directly in PictureBoard component
**Configuration:**
- PictureBoard component calls `useQuizSync(false)`
- Channel created when component mounts
- Expected: Channel stays open during team transitions

**Result:** ❌ **Channel closed during team transitions**
**Issue:** PictureBoard component unmounts during state transitions, triggering cleanup function
**Files Modified:**
- `/src/components/rounds/PictureBoard.tsx` - Added `useQuizSync` hook
- `/src/components/rounds/PictureBoard.tsx` - Added `broadcastAction` calls

---

### Attempt 2: GlobalSync Component
**Approach:** Created separate `PictureBoardSync` component that never unmounts
**Configuration:**
- GlobalSync component rendered outside AnimatePresence
- Conditional `useQuizSync(false)` based on round type
- Expected: Channel persists across all transitions

**Result:** ❌ **React Hooks violation**
**Issue:** Conditional hook calling violated Rules of Hooks
**Error:** "React has detected a change in the order of Hooks called"
**Files Modified:**
- `/src/components/MainDisplay.tsx` - Added GlobalSync component
- `/src/components/MainDisplay.tsx` - Removed sync from PictureBoard

---

### Attempt 3: GlobalSync with Always-Call Hook
**Approach:** Always call `useQuizSync` but disable when not PictureBoard
**Configuration:**
- `useQuizSync(false, !isPictureBoard)` - disable parameter
- Hook always called to maintain order
- Expected: Channel created only for PictureBoard

**Result:** ❌ **Channel still closed during team transitions**
**Issue:** Effect re-ran due to dependency array changes
**Files Modified:**
- `/src/hooks/useQuizSync.ts` - Added `_disabled` parameter
- `/src/components/MainDisplay.tsx` - Updated GlobalSync logic

---

### Attempt 4: Empty Dependency Array
**Approach:** Removed `_disabled` from dependencies to prevent re-runs
**Configuration:**
- `useEffect(() => {...}, [])` - empty dependency array
- Channel created once per component mount
- Expected: No effect re-runs during transitions

**Result:** ❌ **Channel still closed during team transitions**
**Issue:** Component still unmounting despite empty dependencies
**Files Modified:**
- `/src/hooks/useQuizSync.ts` - Updated dependency array
- `/src/components/MainDisplay.tsx` - Simplified sync logic

---

### Attempt 5: MainDisplay Direct Sync (Current)
**Approach:** Moved sync logic directly into MainDisplay component
**Configuration:**
- `useQuizSync(false, !isPictureBoard)` in MainDisplay
- No separate components
- Expected: MainDisplay never unmounts

**Result:** ❌ **STILL BROKEN**
**Issue:** Channel closes during team transitions
**Files Modified:**
- `/src/components/MainDisplay.tsx` - Direct sync in MainDisplay
- `/src/components/rounds/PictureBoard.tsx` - Removed all sync logic

## 📊 Current Log Analysis

### Channel Creation (Working)
```
MainDisplay.tsx:29 [MainDisplay] Render - currentRound: PictureBoard isPictureBoard: true
useQuizSync.ts:15 [QuizSync] useEffect running - _disabled: false
useQuizSync.ts:23 [QuizSync] Creating new channel...
```

### Channel Closure (Problem)
```
useQuizSync.ts:49 [QuizSync] CLEANUP FUNCTION CALLED - This will close the channel!
useQuizSync.ts:50 [QuizSync] Channel ref before cleanup: true
useQuizSync.ts:45 [QuizSync] Channel status: CLOSED
useQuizSync.ts:53 [QuizSync] Channel unsubscribed
```

### Timing Analysis
- **Channel created:** When PictureBoard round starts
- **Channel closes:** Immediately after `teamTimeUp` action processed
- **Missing broadcast:** `selectBoard` for Team 2 never received
- **Impact:** Main app cannot show Team 2 board selection

## 🧩 Root Cause Analysis

### The Fundamental Issue
**MainDisplay component is being unmounted and remounted during PictureBoard team transitions**, despite our attempts to prevent this.

### Why This Happens
1. **AnimatePresence with `key={gameState}`** causes entire content to unmount/remount
2. **State changes during `teamTimeUp` might trigger re-renders
3. **React strict mode** might be causing double renders
4. **Component hierarchy** - parent components might be forcing MainDisplay to unmount

### Technical Insights Learned
1. **Empty dependency array `[]` doesn't prevent cleanup if component unmounts**
2. **AnimatePresence** can cause unexpected component lifecycle issues
3. **React strict mode** can cause double renders that trigger cleanup
4. **State updates** can cause component re-renders even with stable keys
5. **Hook lifecycle** is tied to component lifecycle, not dependency arrays

## ✅ What Works Correctly

### Picture Navigation
- Individual picture navigation works perfectly
- Main app receives all `nextPicture` broadcasts
- Picture state updates correctly
- Timer synchronization works

### Store Logic
- `teamTimeUp` function processes correctly
- Team state transitions work in store
- Debounce protection prevents rapid calls
- Board selection logic functions properly

### Sync Reception
- Main app receives all broadcasts when channel is open
- State updates applied correctly
- Broadcast actions processed in right order

## ❌ What Doesn't Work

### Channel Persistence
- Channel closes during team transitions
- No channel persistence mechanism working
- Cleanup function runs unexpectedly

### Component Stability
- MainDisplay unmounts during PictureBoard round
- Component lifecycle issues persist
- Hook order changes between renders

### Team Transitions
- Main app cannot receive `selectBoard` broadcasts
- Team 2+ board selection fails
- Sync breaks after first team

## 🔧 Next Steps for Future Investigation

### Investigation Areas
1. **AnimatePresence Behavior**
   - Check if `key={gameState}` is causing MainDisplay to unmount
   - Test with different animation approaches
   - Monitor component lifecycle with React DevTools

2. **React Strict Mode**
   - Verify if double renders are causing cleanup
   - Test with strict mode disabled
   - Monitor for unexpected re-renders

3. **State Update Timing**
   - Analyze if `teamTimeUp` state changes trigger re-renders
   - Check if store updates cause component remounts
   - Profile state update timing

4. **Component Hierarchy**
   - Check if parent components force MainDisplay to unmount
   - Examine component tree structure
   - Test with different component placement

### Potential Solutions to Explore
1. **Global Sync Pattern**
   - Move sync outside React component lifecycle
   - Use singleton pattern for channel management
   - Persist channel across component unmounts

2. **Alternative Animation**
   - Replace AnimatePresence with CSS transitions
   - Use different animation libraries
   - Test with no animations

3. **State Management Approach**
   - Use global sync state that persists across renders
   - Implement channel management in store
   - Decouple sync from component lifecycle

4. **Component Architecture**
   - Separate sync logic from React components
   - Use custom hooks with different lifecycle
   - Implement service pattern for sync management

### Debugging Tools
1. **React DevTools Profiler**
   - Track component mounts/unmounts
   - Monitor render performance
   - Identify unexpected re-renders

2. **Granular Logging**
   - Add timing logs for cleanup function
   - Track component render cycles
   - Monitor parent component lifecycle

3. **Environment Testing**
   - Test with React strict mode disabled
   - Test in different browsers
   - Test with different React versions

## 📁 Files Modified

### Core Sync Files
- `/src/hooks/useQuizSync.ts` - Multiple iterations of sync logic, dependency management
- `/src/components/MainDisplay.tsx` - Various approaches to sync placement and component architecture

### PictureBoard Files
- `/src/components/rounds/PictureBoard.tsx` - Removed sync logic, focused on UI rendering only

### Store Files
- `/src/store/quizStore.ts` - Added debounce protection for `teamTimeUp`

## 🎯 Current Status

**Working:**
- Picture navigation and individual sync
- Store logic for team transitions
- Broadcast reception when channel is open

**Broken:**
- Channel persistence during team transitions
- Main app cannot receive `selectBoard` broadcasts for subsequent teams
- Component unmounting during PictureBoard round

**Root Cause:**
MainDisplay component unmounts during PictureBoard team transitions, triggering `useEffect` cleanup function.

**Impact:**
Main app cannot show Team 2+ board selections, breaking the core Picture Board functionality.

**Priority for Next Session:**
Investigate why MainDisplay unmounts during PictureBoard team transitions and implement a solution that keeps the sync channel truly persistent across the entire Picture Board round.

---

*Investigation completed: January 31, 2026*
