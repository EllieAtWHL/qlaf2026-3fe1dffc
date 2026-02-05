# Development Backlog - Non-Priority Items

This document tracks items that need to be fixed or improved but are not current priorities. These will be addressed when time permits or during future development cycles.

---

## 🚨 Highest Priority Backlog Items

### 1. Only Connect Round Critical Crash (BLOCKER)
**Status**: Critical - Complete Failure  
**Priority**: Blocker  
**Description**: After the Only Connect round, the main display breaks completely with a blank screen and JavaScript errors. This completely blocks the quiz from continuing.

**Current Issues**:
- `TypeError: Cannot read properties of undefined (reading 'map')` 
- Complete blank screen on main display after Only Connect round
- Quiz cannot continue after this error
- AudioContext errors may be related but not the root cause

**Error Details**:
```
TypeError: Cannot read properties of undefined (reading 'map')
    at UI (index-o4VkhCKw.js:266:33642)
```

**Files Involved**:
- `src/components/rounds/OnlyConnect.tsx` - Likely source of undefined array
- `src/components/MainDisplay.tsx` - Round rendering logic
- `src/store/quizStore.ts` - State management for Only Connect

**Impact**: Critical - Quiz completely breaks and cannot continue

**Investigation Needed**:
- Check OnlyConnect component for undefined arrays being mapped
- Verify state transitions after Only Connect round
- Check if round data is properly initialized

### 2. Picture Board Navigation Delay (CRITICAL)
**Status**: Needs Immediate Investigation  
**Priority**: Critical  
**Description**: There is often a delay between clicking "next picture" on the cohost app during the picture board round and it progressing on the main display. This is a timed round and delays could cause complaints from contestants.

**Current Issues**:
- Click delay between co-host action and main display response
- Could impact contestant experience in timed round
- Affects flow of picture board round

**Files Involved**:
- `src/components/CoHostInterface.tsx` - Picture navigation broadcasting
- `src/components/PictureBoard.tsx` - Picture display logic
- `src/hooks/useQuizSync.ts` - Sync system performance

**Impact**: High - Contestants may notice delays during timed rounds

### 3. Picture Board Timer Sync Issue
**Status**: Needs Investigation  
**Priority**: High  
**Description**: The timer on the co-host app for the picture board round is not properly synchronized with the main display timer.

**Current Issues**:
- Co-host timer may start with a delay compared to main display
- Timer controls on co-host may not work consistently
- Timer broadcasting logic needs refinement

**Files Involved**:
- `src/components/CoHostInterface.tsx` - Timer broadcasting logic
- `src/components/Timer.tsx` - Timer display component
- `src/hooks/useQuizSync.ts` - Sync system

**Notes**:
- Main display timer works correctly
- Auto-start functionality works but needs sync refinement
- Architecture is correct (only CoHostInterface broadcasts)

---

## 📋 Other Backlog Items

### 2. Timer Sound Effects
**Status**: Working but with 403 errors  
**Priority**: Low  
**Description**: Timer sound effects are failing to load due to 403 errors from external sound URLs.

**Current Issues**:
- `https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3` - 403 Forbidden
- `https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3` - 403 Forbidden

**Files Involved**:
- `src/components/Timer.tsx` - Sound effect initialization

**Potential Solutions**:
- Find alternative free sound sources
- Host sounds locally
- Remove sounds if not critical

---

### 3. Only Connect Progressive Reveal UI
**Status**: UI Improvement Needed  
**Priority**: Low  
**Description**: Move the progressive reveal functionality into the questions section for the Only Connect round to improve user experience.

**Current Issues**:
- Progressive reveal controls may not be optimally positioned
- Could improve layout and user interaction flow
- Better integration with questions section

**Files Involved**:
- `src/components/rounds/OnlyConnect.tsx` - Progressive reveal logic and UI
- `src/components/CoHostInterface.tsx` - Co-host controls for Only Connect

**Potential Improvements**:
- Move reveal controls into questions section
- Better visual integration with question display
- Improved user experience for co-host

---

### 4. Ellie's Tellies Static Effect and Image Overlay Improvements
**Status**: Enhancement Needed  
**Priority**: Medium  
**Description**: Improve the TV static transition effect and adjust the image overlay size/position to better fit within the TV frame.

**Current Issues**:
- Static effect needs more realistic CRT TV interference patterns
- Image overlay size and positioning doesn't perfectly align with TV screen area
- Could enhance the "tuning in" effect for better user experience

**Files Involved**:
- `src/components/rounds/ElliesTellies.tsx` - Static animation and image positioning
- `public/images/ellies-tellies/` - TV frame and question images

**Potential Improvements**:
- Enhance static noise patterns for more authentic CRT effect
- Fine-tune image overlay dimensions to better fit TV screen area
- Adjust positioning to align perfectly within TV frame
- Consider additional CRT effects like screen curvature or color bleeding

**Impact**: Medium - Improves user experience but doesn't break functionality

---

## 🔧 Technical Debt

### 1. Excessive Console Logging
**Status**: Cleanup Needed  
**Priority**: Low  
**Description**: Large amount of console.log statements throughout the codebase that should be cleaned up for production.

**Current Issues**:
- Over 50 console.log statements in quizStore.ts for debugging
- Extensive logging in useQuizSync.ts for sync operations
- Debug logging in components that should be removed

**Files Involved**:
- `src/store/quizStore.ts` - Debug logging in picture board functions
- `src/hooks/useQuizSync.ts` - Sync operation logging
- `src/components/CoHostInterface.tsx` - Debug logging
- `src/pages/NotFound.tsx` - Error logging

**Impact**: Performance impact in production, console pollution

### 2. Type Safety Issues with `any` Types
**Status**: Type Safety Improvements Needed  
**Priority**: Low  
**Description**: Multiple instances of `any` type usage that reduce type safety and make the code harder to maintain.

**Current Issues**:
- `questionsData as any` in multiple locations
- Function parameters using `any` type
- Component props using `any` type

**Files Involved**:
- `src/store/quizStore.ts` - Data casting with `as any`
- `src/hooks/useQuizSync.ts` - Function parameters and data handling
- `src/hooks/useQuestions.ts` - Board mapping with `any`
- `src/components/CoHostInterface.tsx` - Question handling with `any`

**Impact**: Reduced type safety, potential runtime errors

### 3. Hardcoded Configuration Values
**Status**: Configuration Management Needed  
**Priority**: Low  
**Description**: Hardcoded values scattered throughout the codebase that should be centralized.

**Current Issues**:
- Hardcoded board IDs ['board-1', 'board-2', 'board-3']
- Magic numbers for team selection (4 for completion)
- Hardcoded timer values and delays

**Files Involved**:
- `src/store/quizStore.ts` - Board IDs and team logic
- `src/components/CoHostInterface.tsx` - Timer delays

**Impact**: Difficult to maintain, inflexible configuration

### 4. Component Map with Weak Typing
**Status**: Type System Improvements Needed  
**Priority**: Low  
**Description**: Component mapping in MainDisplay uses weak typing that could be improved.

**Current Issues**:
- `Record<string, React.ComponentType<any>>` in MainDisplay.tsx
- Potential for runtime errors with component mapping

**Files Involved**:
- `src/components/MainDisplay.tsx` - Component mapping

**Impact**: Runtime type safety issues

---

## 📝 Notes for Future Development

### Architecture Rules to Maintain:
- ✅ Only CoHostInterface should call useQuizSync and broadcast actions
- ✅ MainDisplay and all round components should only read from useQuizStore
- ✅ Timer broadcasting should be handled by CoHostInterface
- ✅ Main display must maintain 16:9 aspect ratio
- ✅ Co-host app must be mobile-optimized

### Testing Checklist for Timer Fix:
- [ ] Timer starts automatically when first picture appears
- [ ] Co-host and main display timers start within 1 second of each other
- [ ] Timer controls work properly on co-host app
- [ ] Timer ticks sync correctly between both displays
- [ ] Timer stops properly when round ends or game resets

---

**Last Updated**: 2026-02-01 at 11:15 PM UTC  
**Next Review**: When addressing critical Only Connect crash or timer sync issues
