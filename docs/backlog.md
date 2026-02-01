# Development Backlog - Non-Priority Items

This document tracks items that need to be fixed or improved but are not current priorities. These will be addressed when time permits or during future development cycles.

---

## 🚨 High Priority Backlog Items

### 1. Picture Board Timer Sync Issue
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

### 3. Picture Board UI Enhancements
**Status**: Complete  
**Priority**: N/A  
**Description**: Successfully implemented picture number circles and improved image sizing.

**Completed Items**:
- ✅ Replaced "Picture X of Y" text with numbered circles
- ✅ Added circles to both individual and grid views
- ✅ Made circles filled with solid background
- ✅ Positioned circles in top-right corners
- ✅ Increased image size by reducing padding

---

## 🔧 Technical Debt

### 4. Channel Cleanup Logic
**Status**: Improved but could be enhanced  
**Priority**: Low  
**Description**: useQuizSync channel cleanup logic was improved but could be further enhanced for better reliability.

**Files Involved**:
- `src/hooks/useQuizSync.ts`

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

**Last Updated**: 2026-02-01  
**Next Review**: When addressing timer sync issues
