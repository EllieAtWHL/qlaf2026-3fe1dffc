# Development Backlog - Non-Priority Items

This document tracks items that need to be fixed or improved but are not current priorities. These will be addressed when time permits or during future development cycles.

---

## 🚨 Highest Priority Backlog Items

### 1. Picture Board Navigation Delay (CRITICAL)
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

### 2. Picture Board Timer Sync Issue
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

### 3. Picture Board Lost Functionality Analysis
**Status**: 📋 Needs Assessment  
**Priority**: High  
**Date Added**: 2026-02-22  
**Description**: During Picture Board optimization process, some functionality may have been removed or altered. Need to assess what was lost and restore if needed.

**Potential Lost Functionality**:
- **Timer auto-start behavior** - Was disabled to fix delays, but may be needed
- **Timer broadcasting** - Was disabled for performance, but sync may be affected
- **Console logging** - Was removed for production, but debugging capability lost
- **Complex component features** - Simplified architecture may have removed advanced features
- **Debug functionality** - Performance timing code was added, may need cleanup

**Assessment Required**:
- [ ] Review timer functionality - determine if auto-start is still needed
- [ ] Test timer synchronization - ensure manual controls work properly
- [ ] Verify all Picture Board features - check for missing functionality
- [ ] Clean up debug code - remove performance timing statements
- [ ] Test edge cases - ensure all scenarios still work
- [ ] User testing - get feedback on any missing features

**Files to Review**:
- `src/components/rounds/PictureBoard.tsx` - Compare with original for missing features
- `src/components/CoHostInterface.tsx` - Check timer controls functionality
- `src/store/quizStore.ts` - Verify timer-related state management
- `src/hooks/useQuizSync.ts` - Ensure sync system完整性

**Impact**: Medium - Could affect user experience if critical features were accidentally removed

**Next Steps**:
1. Test all Picture Board functionality thoroughly
2. Compare with original requirements
3. Restore any missing features if needed
4. Clean up temporary debug code
5. Update documentation based on findings

---

## 🖼️ Only Connect Images Not Displaying

### Only Connect Image Display Issue
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

### Picture Board Items to Replace
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

## �� Other Backlog Items

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

### 5. GenericRound Question Transition Enhancement
**Status**: Enhancement Opportunity  
**Priority**: Low  
**Description**: Add smooth transitioning for questions in GenericRound to make them take up more screen space before answers are revealed, improving visual impact and user engagement.

**Current Issues**:
- Questions appear in fixed size without dramatic presentation
- Could enhance visual hierarchy when transitioning from question to answer
- Opportunity to create more cinematic question reveal experience

**Desired Enhancement**:
- Question should appear larger and more prominent initially
- Smooth transition when answers are revealed to make space for answer content
- Maintain clean layout while adding visual interest
- Should work across all rounds using GenericRound (Just One, etc.)

**Files Involved**:
- `src/components/rounds/GenericRound.tsx` - Question layout and transitions
- `src/components/MainDisplay.tsx` - Round container layout

**Potential Implementation**:
- Large centered question before answer reveal
- Smooth scaling/positioning animation when answer is shown
- Maintain 16:9 aspect ratio requirements
- Ensure auto-scroll functionality continues to work

**Impact**: Low - Visual enhancement only, doesn't affect functionality

---

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

## ✅ Resolved Issues

### 1. Only Connect Round Critical Crash (RESOLVED)
**Status**: Fixed - No longer crashes  
**Priority**: Previously Blocker  
**Date Resolved**: 2026-02-21  
**Description**: After Only Connect round, main display was breaking completely with a blank screen and JavaScript errors. This completely blocked quiz from continuing.

**Root Cause**: `OnlyConnect` component attempted to access `question.options.map()` during round transition before new round's question data had loaded.

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

**Last Updated**: 2026-02-21 at 10:45 PM UTC  
**Next Review**: When addressing critical Picture Board navigation delays or timer sync issues
