# Development Backlog - Non-Priority Items

This document tracks items that need to be fixed or improved but are not current priorities. These will be addressed when time permits or during future development cycles.

---

## 🚨 Highest Priority Backlog Items

### 1. Wipeout Round Implementation
**Status**: ⚠️ PARTIALLY COMPLETED  
**Priority**: Medium  
**Date Added**: 2026-02-22  
**Date Completed**: 2026-03-22  
**Description**: Build out complete Wipeout round functionality.

**Requirements**:
- ✅ Implement Wipeout game mechanics with correct/incorrect answers
- ✅ Create question grid and selection interface
- ✅ Add wipeout penalty system and scoring
- ✅ Ensure proper integration with quiz store and sync system
- ✅ Design UI for both main display and co-host interface
- ✅ Enhanced "Show On Screen" button to reveal all answers
- ✅ Added wipeout display in generic answer section

**Files Implemented**:
- ✅ `src/components/rounds/Wipeout.tsx` - Created new round component
- ✅ `src/components/CoHostInterface.tsx` - Added Wipeout controls
- ✅ `src/data/questions.json` - Added Wipeout question data
- ✅ `src/store/quizStore.tsx` - Added Wipeout state management
- ✅ `src/types/questions.ts` - Added WipeoutOption interface
- ✅ `src/hooks/useQuizSync.ts` - Added Wipeout sync actions

**Impact**: High - Essential quiz round fully functional with enhanced co-host features

**Next Steps**:
- Create additional questions for Wipeout round to increase variety

---

**Requirements**:
- Implement one-minute timer with proper countdown
- Create rapid-fire question and answer system
- Add scoring for correct answers within time limit
- Ensure proper integration with quiz store and sync system
- Design UI for both main display and co-host interface

**Files Involved**:
- `src/components/rounds/OneMinuteRound.tsx` - Create new round component
- `src/components/CoHostInterface.tsx` - Add One Minute controls
- `src/data/questions.json` - Add One Minute question data
- `src/store/quizStore.tsx` - Add One Minute state management

**Impact**: High - Essential quiz round that needs to be fully functional

---

### 3. F1 Finale Implementation
**Status**: Development Needed  
**Priority**: High  
**Date Added**: 2026-02-22  
**Description**: Build out the complete F1 Grand Prix finale round functionality.

**Requirements**:
- Implement F1 Grand Prix game mechanics and scoring
- Create question display and answer reveal functionality
- Add finale-specific features and dramatic presentation
- Ensure proper integration with quiz store and sync system
- Design UI for both main display and co-host interface

**Files Involved**:
- `src/components/rounds/F1GrandPrix.tsx` - Create new round component
- `src/components/CoHostInterface.tsx` - Add F1 Finale controls
- `src/data/questions.json` - Add F1 Finale question data

---

## 🖼️ Picture Board Image Replacements

### 5. Picture Board Items to Replace
**Status**: Content Updates Needed  
**Priority**: Medium  
**Description**: Several images in the Picture Board rounds are marked for replacement with TODO comments in the questions.json file.

**Items to Replace**:

**Board A (Sporting A)**:
- ID 7: Andy Murray - `/images/picture-board/AndyMurray.png`
- ID 11: Gary Lineker - `/images/picture-board/GaryLineker.png`

**Board B (B Sports)**:
- ID 3: Luke Littler - `/images/picture-board/LukeLittler.png`

**Board C (C Sport)**:
- ID 2: Dennis Taylor - `/images/picture-board/DennisTaylor.png`
- ID 7: Ally McCoist - `/images/picture-board/AllyMcCoist.png`
- ID 8: Neymar - `/images/picture-board/Neymar.png`

**Files Involved**:
- `src/data/questions.json` - Remove TODO comments after replacement
- `/public/images/picture-board/` - Replace image files

**Action Required**:
1. Replace the 6 marked images with new sports personalities
2. Update the answer text and image paths in questions.json
3. Remove the `/*TODO: Replace*/` comments from the JSON file

---

## 🖼️ Only Connect Progressive Reveal UI

### 6. Only Connect Progressive Reveal Issue
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
- Move reveal controls into questions section for better UX
- Better visual integration with question display
- Improved user experience for co-host

---

## 🖼️ GenericRound Question Transition Enhancement

### 7. GenericRound Question Transition Issue
**Status**: Enhancement Opportunity  
**Priority**: Low  
**Description**: Add smooth transitioning for questions in GenericRound to make them take up more screen space before answers are revealed, improving visual impact and user engagement.

**Current Issues**:
- Questions appear in fixed size without dramatic presentation
- Could enhance visual hierarchy when transitioning from question to answer
- Opportunity to create more cinematic question reveal experience

**Desired Enhancement**:
- Large centered question before answer reveal
- Smooth transition when answers are revealed to make space for answer content
- Maintain clean layout while adding visual interest
- Should work across all rounds using GenericRound

**Files Involved**:
- `src/components/rounds/GenericRound.tsx` - Question layout and transitions
- `src/components/MainDisplay.tsx` - Round container layout

---

## 🖼️ Ellie's Tellies Static Effect and Image Overlay Improvements

### 8. Ellie's Tellies Static Effect and Image Overlay Issue
**Status**: Enhancement Needed  
**Priority**: Medium  
**Description**: Improve the TV static transition effect and adjust the image overlay size/position to better fit within the TV screen area.

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

---

### 4. Only Connect Images Not Displaying
**Status**: ✅ RESOLVED  
**Priority**: Medium  
**Date Resolved**: 2026-02-22  
**Description**: Images in the Only Connect round were not showing up properly on the main display.

**Solution Implemented**:
- Fixed image rendering logic in OnlyConnect component
- Resolved image path issues in questions.json
- Ensured proper image loading and display functionality
- All visual clues now display correctly during Only Connect rounds

**Files Updated**:
- `src/components/rounds/OnlyConnect.tsx` - Image rendering logic fixed
- `src/data/questions.json` - Image paths corrected

**Impact**: Only Connect round now displays images properly, enhancing user experience

---

## 🐛 Bug Fixes & Issues

### Recent Fixes
- **Chris Stadia Round Transition Bug** (2026-03-30): Fixed hardcoded limit in sync handler preventing transitions from Chris Stadia to F1 Grand Prix. See `/docs/round-transition-hardcoded-limit-bug.md` for complete analysis.
- **Only Connect Round Transition Bug** (2026-02-21): Fixed Only Connect round transition bug causing main display to break completely with JavaScript errors. See `/docs/only-connect-round-transition-bug.md` for complete analysis.

### Known Issues
- None currently identified

---

## ✅ Resolved Issues

### 1. Wipeout Round Implementation
**Status**: ✅ COMPLETED  
**Priority**: High  
**Date Added**: 2026-02-22  
**Date Completed**: 2026-03-22  
**Description**: Build out complete Wipeout round functionality.

**Requirements**:
- ✅ Implement Wipeout game mechanics with correct/incorrect answers
- ✅ Create question grid and selection interface
- ✅ Add wipeout penalty system and scoring
- ✅ Ensure proper integration with quiz store and sync system
- ✅ Design UI for both main display and co-host interface
- ✅ Enhanced "Show On Screen" button to reveal all answers
- ✅ Added wipeout display in generic answer section

**Files Implemented**:
- ✅ `src/components/rounds/Wipeout.tsx` - Created new round component
- ✅ `src/components/CoHostInterface.tsx` - Added Wipeout controls
- ✅ `src/data/questions.json` - Added Wipeout question data
- ✅ `src/store/quizStore.tsx` - Added Wipeout state management
- ✅ `src/types/questions.ts` - Added WipeoutOption interface
- ✅ `src/hooks/useQuizSync.ts` - Added Wipeout sync actions

**Impact**: High - Essential quiz round fully functional with enhanced co-host features

**Next Steps**:
- Create additional questions for Wipeout round to increase variety

---

### 2. Round Robin Round Implementation
**Status**: ✅ RESOLVED  
**Priority**: High  
**Date Resolved**: 2026-02-27  
**Description**: Build out the complete Round Robin round functionality.

**Implementation Completed**:
- ✅ **GenericRound Component Enhancement** - Enhanced with smooth answer animations and separate question/answer cards
- ✅ **Question Animation System** - Question card animates to y: "-200%" when answer revealed with 0.6s easeInOut transition
- ✅ **Answer Card Positioning** - Separate answer card positioned at top-56 with fade-in animation
- ✅ **Answer Display Enhancement** - Increased answer card height to max-h-80 for better visibility
- ✅ **Comprehensive Questions Added** - 3 Round Robin questions including Super Bowl MVP (50 answers) and Championship Playoffs (28 teams)
- ✅ **Question Migration** - Moved British gold medalists question from Just One to Round Robin
- ✅ **Test Suite Created** - 14 comprehensive tests covering all GenericRound functionality
- ✅ **Documentation Complete** - Full technical and quizmaster guide created
- ✅ **16:9 Aspect Ratio Compliance** - Maintains TV display requirements
- ✅ **Architecture Compliance** - Follows sync architecture rules (no useQuizSync in components)

**Files Implemented**:
- `src/components/rounds/GenericRound.tsx` - Enhanced with smooth animations and separate cards
- `src/data/questions.json` - Added comprehensive Round Robin questions
- `src/__tests__/generic-round.test.tsx` - Created comprehensive test suite
- `docs/generic-round-documentation.md` - Complete technical and quizmaster documentation

**Questions Added**:
- rr-1: "Name a British gold medalist from the last Summer or Winter Olympics (41)" - 41 answers with events
- rr-2: "Name a Super Bowl MVP (50)" - 50 answers with win counts  
- rr-3: "Name a team that has won what is currently the CHampionship Playoffs (28)" - 28 teams with win counts

**Impact**: High - Round Robin round is now fully functional with polished animations and comprehensive question support

---

### 3. Picture Board Lost Functionality Analysis
**Status**: ✅ RESOLVED  
**Priority**: High  
**Date Resolved**: 2026-02-22  
**Description**: Picture Board optimization process left uncertain what functionality may have been removed or altered.

**Solutions Implemented**:
- ✅ **Timer auto-start behavior** - Successfully implemented - timer now auto-starts when first picture appears
- ✅ **Timer broadcasting** - Properly refined in CoHostInterface for sync
- ✅ **Image preloading** - Moved to MainDisplay with automatic preloading of all quiz images
- ✅ **AudioContext initialization** - Fixed by enabling sounds via co-host app interaction to bypass browser blocking
- ✅ **Require error** - Fixed by replacing require with import for browser compatibility
- ✅ **Test structure unified** - All tests now run consistently with npm test via Vitest

**Files Updated**:
- `src/components/CoHostInterface.tsx` - Timer controls and co-host interactions properly configured
- `src/components/MainDisplay.tsx` - Image preloading and AudioContext initialization
- `src/components/Timer.tsx` - Sound playback with proper error handling
- Test structure unified - all tests now run with npm test

**Functionality Verified**:
- Picture Board round functions completely with auto-starting timer
- Main display and co-host timers properly synchronized
- All images preload automatically in MainDisplay browser
- Audio playback works reliably without requiring main display clicks
- Tests run successfully without errors

**Impact**: All critical functionality preserved and enhanced with better architecture

---

### 3. Picture Board Lost Functionality Assessment (2026-03-22)
**Status**: ✅ RESOLVED  
**Priority**: High  
**Date Resolved**: 2026-03-22  
**Description**: Complete verification testing for Picture Board functionality after optimization process.

**Verification Completed**:
- ✅ Complete user testing on all Picture Board features
- ✅ Verify no edge cases were missed during optimization
- ✅ Clean up any temporary debug code if present
- ✅ Final performance testing with full question sets
- ✅ Test all Picture Board board variations (A, B, C)

**Files Modified**:
- `src/components/CoHostInterface.tsx` - Timer controls and co-host interactions properly configured
- `src/components/MainDisplay.tsx` - Image preloading and AudioContext initialization
- `src/components/Timer.tsx` - Sound playback with proper error handling

**Impact**: High - Picture Board round fully verified and functional for quiz usage

---

### 4. Timer Sound Effects
**Status**: ✅ RESOLVED  
**Priority**: Low  
**Date Resolved**: 2026-02-22  
**Description**: Timer sound effects were failing to load due to 403 errors from external sound URLs.

**Solution Implemented**:
- Downloaded free CC0-licensed sounds from Pixabay
- Hosted locally in `public/sounds/` directory
- Updated Timer component to use local sound paths
- Renamed buzzer to time-up for future buzz-in rounds
- Implemented Web Audio API beeps as fallback
- Added warning sound at 10 seconds before time-up
- Fixed critical infinite loop in timer sound behavior
- Improved error handling for audio playback

**Files Added**:
- `public/sounds/tick.mp3` - Countdown tick sound
- `public/sounds/warning.mp3` - 10-second warning bell
- `public/sounds/time-up.mp3` - Time-up sound

**Files Updated**:
- `src/components/Timer.tsx` - Local sound paths, Web Audio API implementation, and variable names
- All related documentation updated for sound architecture

**Benefits**:
- No more CORS or 403 errors
- Faster loading (no external requests)
- Reliable sound playback with fallback support
- Future-proof for buzz-in rounds
- Timer architecture properly documented

---

### 3. Only Connect Round Critical Crash
**Status**: ✅ RESOLVED  
**Priority**: Previously Blocker  
**Date Resolved**: 2026-02-21  
**Description**: After Only Connect round, main display was breaking completely with JavaScript errors when transitioning to next round.

**Root Cause**:
- `OnlyConnect` component attempted to access `question.options.map()` during round transition before new round's question data had loaded

**Fix Applied**:
- Added null checks for `question.options` throughout OnlyConnect component
- Used optional chaining `?.` for safe property access
- Enhanced initial validation to check both question and options availability
- Added proper loading state handling during transitions

**Files Changed**:
- `src/components/rounds/OnlyConnect.tsx` - Added defensive null checks
- `docs/only-connect-crash-analysis.md` - Created comprehensive documentation

**Testing**: Round transitions now work without crashes, quiz can continue normally.

---

### 4. Only Connect Images Not Displaying
**Status**: ✅ RESOLVED  
**Priority**: Medium  
**Date Resolved**: 2026-02-22  
**Description**: Images in the Only Connect round were not showing up properly on the main display.

**Solution Implemented**:
- Fixed image rendering logic in OnlyConnect component
- Resolved image path issues in questions.json
- Ensured proper image loading and display functionality
- All visual clues now display correctly during Only Connect rounds

**Files Updated**:
- `src/components/rounds/OnlyConnect.tsx` - Image rendering logic fixed
- `src/data/questions.json` - Image paths corrected

**Impact**: Only Connect round now displays images properly, enhancing user experience

---

## 🎯 GameCard Component Refactoring

### 10. Refactor Round Components to Use GameCard Components
**Status**: ✅ PARTIALLY COMPLETED  
**Priority**: Medium  
**Date Added**: 2026-03-22  
**Date Completed**: 2026-03-30  
**Description**: Refactor all round components to use the new reusable GameCard components for consistency and maintainability.

**Background**:
- ✅ **GameCard Components Created**: Successfully created reusable GameCard, RevealGameCard, ImageGameCard, and TextGameCard components
- ✅ **Wipeout Integration**: Successfully refactored Wipeout round to use RevealGameCard with proper flip animations and glass styling
- ✅ **Chris Stadia Integration**: Chris Stadia round is also working well with the new GameCard components
- ✅ **Dave's Dozen Integration**: Successfully refactored Dave's Dozen to use ImageGameCard with image fill and text overlay functionality
- ✅ **Animation Timing Consistency**: Implemented consistent reveal animation timing (0.3s/0.4s delays) across all rounds using common GameCard components
- ✅ **Benefits Demonstrated**: Consistent animations, glass morphism styling, reduced code duplication, and comprehensive test coverage

**Components Successfully Refactored**:
- ✅ **Dave's Dozen round** - Replaced custom card implementations with ImageGameCard components
- ✅ **Chris Stadia round** - Using RevealGameCard with proper flip animations and glass styling
- ✅ **Wipeout round** - Using RevealGameCard for answer reveals

**Components Remaining to Refactor**:
- **Picture Board round** - Replace custom card implementations with GameCard components
- **Only Connect round** - Use RevealGameCard for clue reveals
- **World Rankings round** - Use ImageGameCard for country/athlete displays
- **Ellie's Tellies round** - Use ImageGameCard for TV screen overlays
- **F1 Grand Prix round** - Use RevealGameCard for answer reveals
- **One Minute round** - Use TextGameCard for rapid-fire questions
- **Generic Round** - Use appropriate GameCard components for answer displays

**Benefits Achieved**:
- ✅ **Visual Consistency**: Refactored rounds have consistent flip animations and glass card styling
- ✅ **Code Maintainability**: Card logic centralized in GameCard components
- ✅ **Reduced Duplication**: Eliminated repeated card styling and animation code in refactored rounds
- ✅ **Enhanced Features**: Image fill functionality, text overlay with legibility, consistent animation timing
- ✅ **Test Coverage**: Comprehensive unit tests (12 tests) for GameCard components ensuring future development protection
- ✅ **Architecture Compliance**: All components follow sync architecture rules and display requirements

**Files Successfully Updated**:
- ✅ `src/components/ui/GameCard.tsx` - Enhanced with image fill, text overlay, and consistent timing
- ✅ `src/components/rounds/DavesDozen.tsx` - Refactored to use ImageGameCard
- ✅ `src/components/rounds/ChrisStadia.tsx` - Fixed animation timing and centering
- ✅ `src/components/ui/__tests__/GameCard.test.tsx` - Comprehensive test suite created
- ✅ `docs/gamecard-components.md` - Complete documentation created

**Impact**: High - Significantly improves code maintainability and visual consistency across refactored rounds, with foundation in place for completing remaining rounds

**Next Steps**:
- Complete refactoring of remaining round components (Picture Board, Only Connect, World Rankings, Ellie's Tellies, F1 Grand Prix, One Minute, Generic Round)
- Continue leveraging consistent GameCard architecture for all future round development

---

### 9. DavesDozen Test Suite Enhancements
**Status**: Test Optimization Needed  
**Priority**: Low  
**Date Added**: 2026-02-22  
**Description**: Improve test quality and reduce over-mocking in DavesDozen test suite while adding missing edge case coverage.

**Current Assessment**:
- ✅ **Good foundation**: Tests are sturdy and follow React Testing Library best practices
- ✅ **Appropriate mocking**: Correctly mocks external dependencies (useQuizStore, useQuestions)
- ✅ **Realistic data**: Uses complete interfaces and proper typing
- ⚠️ **Over-mocking**: Mocks entire ROUNDS array when only specific round needed
- ⚠️ **Missing edge cases**: No tests for showAnswer state, partial revealing, different round indices

**Improvements Needed**:

**1. Reduce Mock Scope**:
```typescript
// Current: Mocking entire ROUNDS array
ROUNDS: [/* full 6-round array */]

// Better: Only mock what's needed
ROUNDS: [
  { id: 'daves-dozen', name: "Dave's Dozen", timerDuration: null }
]
```

**2. Add Missing Test Cases**:
- Test `showAnswer` state functionality
- Test partial answer revealing (e.g., 6 of 12 answers revealed)
- Test different `currentRoundIndex` values
- Test edge cases like all answers revealed vs none revealed

**3. Consolidate Test Data**:
- Remove duplicate `mockStore` objects between test suites
- Create shared test constants for better maintainability
- Standardize mock data structure across all tests

**Files Involved**:
- `src/__tests__/daves-dozen.test.tsx` - Main test file to optimize

**Specific Tasks**:
- [ ] Refactor ROUNDS mock to only include necessary round
- [ ] Add test for `showAnswer` state
- [ ] Add test for partial answer revealing scenarios
- [ ] Add test for different `currentRoundIndex` values
- [ ] Consolidate duplicate mock store objects
- [ ] Create shared test constants for better maintainability

**Expected Benefits**:
- Faster test execution (reduced mock overhead)
- Better test maintainability
- More comprehensive edge case coverage
- Cleaner, more focused test code

**Impact**: Low - Improves code quality and test reliability but doesn't affect user functionality

---

## 🎯 Dave's Dozen Round Enhancement

### 8. Add More Questions to Dave's Dozen
**Status**: Content Development Needed  
**Priority**: Medium  
**Date Added**: 2026-02-22  
**Description**: Expand Dave's Dozen question set beyond current 2 questions to provide variety for quiz gameplay.

**Current Questions**:
- ✅ dd-1: "Name every goalscorer for Tottenham in their successful Europa League run" (12 players)
- ✅ dd-2: "Name every current Scottish Premiership team" (12 teams)

**Additional Question Ideas**:
- Premier League Golden Boot winners
- England cricket World Cup winners
- F1 drivers with multiple championships
- Olympic sports with British gold medalists
- Tennis Grand Slam winners by nationality
- Rugby World Cup winning captains

**Files Involved**:
- `src/data/questions.json` - Add new question objects with answers array
- `/public/images/daves-dozen/` - Add corresponding image assets

**Action Required**:
1. Research and verify 12 items for each question topic
2. Create or source appropriate images for each answer
3. Add new question objects to questions.json following existing format
4. Test new questions with Dave's Dozen functionality

**Impact**: Medium - Increases quiz variety and replay value

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

**Last Updated**: 2026-03-30 at 7:15 PM UTC  
**Next Review**: When addressing Picture Board image issues or remaining GameCard refactoring

### Current Next Actions:
1. **CRITICAL**: Build out One Minute round implementation
2. **CRITICAL**: Build out F1 Grand Prix finale implementation
3. **HIGH PRIORITY**: Investigate and fix Picture Board image replacement needs (6 sports personality images marked for replacement)
4. **HIGH PRIORITY**: Complete GameCard refactoring for remaining rounds (Picture Board, Only Connect, World Rankings, Ellie's Tellies, F1 Grand Prix, One Minute, Generic Round)
5. **MEDIUM**: Enhance Ellie's Tellies static effect and image overlay positioning
6. **LOW**: Implement GenericRound question transition enhancements for better visual presentation
7. **LOW**: Move Only Connect progressive reveal controls into questions section
8. **LOW**: Create additional Only Connect questions and add to questions.json (track assets in public/images/)
9. **LOW**: Optimize DavesDozen test suite (reduce mocking, add edge cases, consolidate test data)

### Recently Completed (2026-03-30):
✅ **GameCard Component Refactoring** - Partially completed with Dave's Dozen, Chris Stadia, and Wipeout rounds successfully refactored
✅ **Animation Timing Consistency** - Implemented consistent reveal timing (0.3s/0.4s) across all GameCard components  
✅ **Image Fill & Text Overlay** - Added full-size image fill with legible text overlay functionality
✅ **Comprehensive Test Coverage** - Created 12 unit tests for GameCard components with full coverage
✅ **Documentation Complete** - Created comprehensive GameCard component documentation and migration guide
