# Development Backlog - Non-Priority Items

This document tracks items that need to be fixed or improved but are not current priorities. These will be addressed when time permits or during future development cycles.

---

## 🚨 Highest Priority Backlog Items

### 1. Picture Board Lost Functionality Assessment
**Status**: In Progress - Implementation Complete, Testing Ongoing  
**Priority**: High  
**Date Added**: 2026-02-22  
**Description**: Verify that all Picture Board functionality has been properly preserved and restored after optimization process.

**Functionality Implemented**:
- ✅ **Timer auto-start behavior** - Successfully implemented - timer now auto-starts when first picture appears
- ✅ **Timer broadcasting** - Properly refined in CoHostInterface for sync
- ✅ **Image preloading** - Moved to MainDisplay with automatic preloading of all quiz images
- ✅ **AudioContext initialization** - Fixed by enabling sounds via co-host app interaction to bypass browser blocking
- ✅ **Require error** - Fixed by replacing require with import for browser compatibility
- ✅ **Test structure unified** - All tests now run consistently with npm test via Vitest

**Verification Tasks Remaining**:
- [ ] Complete user testing on all Picture Board features
- [ ] Verify no edge cases were missed during optimization
- [ ] Clean up any temporary debug code if present
- [ ] Final performance testing with full question sets
- [ ] Test all Picture Board board variations (A, B, C)

**Files Modified**:
- `src/components/CoHostInterface.tsx` - Timer controls and co-host interactions properly configured
- `src/components/MainDisplay.tsx` - Image preloading and AudioContext initialization
- `src/components/Timer.tsx` - Sound playback with proper error handling

**Impact**: High - Ensures Picture Board round is fully functional for quiz usage

---

## 🖼️ Only Connect Images Not Displaying

### 2. Only Connect Image Display Issue
**Status**: Needs Investigation  
**Priority**: Medium  
**Description**: Images in the Only Connect round are not showing up properly on the main display.

**Current Issues**:
- Images fail to display during Only Connect rounds
- May be related to image paths, loading, or rendering logic
- Could affect user experience if visual clues are missing

**Files Involved**:
- `src/components/rounds/OnlyConnect.tsx` - Image rendering logic
- `src/data/questions.json` - Image paths and question data
- `/public/images/` - Image assets location

**Fallback Option**:
- Can convert to text-only round if images cannot be fixed
- Ensure text alternatives are available for all image-based questions

**Impact**: Medium - Affects round presentation but doesn't break functionality

---

## 🖼️ Picture Board Image Replacements

### 3. Picture Board Items to Replace
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

### 4. Only Connect Progressive Reveal Issue
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

### 5. GenericRound Question Transition Issue
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

### 6. Ellie's Tellies Static Effect and Image Overlay Issue
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

## ✅ Resolved Issues

### 1. Picture Board Lost Functionality Analysis
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

### 2. Timer Sound Effects
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

**Last Updated**: 2026-02-22 at 4:30 PM UTC  
**Next Review**: When addressing Picture Board image issues or Only Connect image display problems

### Current Next Actions:
1. **IMMEDIATE**: Complete verification testing for Picture Board functionality (user testing and edge cases)
2. **HIGH PRIORITY**: Diagnose and fix Only Connect round image display issues
3. **HIGH PRIORITY**: Investigate and fix Picture Board image replacement needs (6 sports personality images marked for replacement)
4. **MEDIUM**: Enhance Ellie's Tellies static effect and image overlay positioning
5. **LOW**: Implement GenericRound question transition enhancements for better visual presentation
6. **LOW**: Move Only Connect progressive reveal controls into questions section

7. **LOW**: Create additional Only Connect questions and add to  (track assets in )
