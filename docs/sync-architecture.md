# Sync Architecture Guide

## 🚨 CRITICAL RULE: useQuizSync Usage

**ONLY CoHostInterface should call `useQuizSync`. NEVER call it from MainDisplay or any round components.**

---

## The Problem

When multiple components call `useQuizSync`, they create multiple Supabase channels, causing:
- **Double-reveal issues** (e.g., Only Connect revealing 2 clues at once)
- **Actions being executed multiple times**
- **State synchronization conflicts**
- **Race conditions in broadcasting**

---

## ✅ Correct Architecture

### Components That CAN Call useQuizSync:
- **CoHostInterface.tsx** - ✅ Calls `useQuizSync(true)` and broadcasts all actions

### Components That MUST NEVER Call useQuizSync:
- **MainDisplay.tsx** - ❌ Only reads from `useQuizStore`
- **All Round Components** - ❌ Only read from `useQuizStore`
  - OnlyConnect.tsx
  - WorldRankings.tsx
  - F1GrandPrix.tsx
  - OneMinuteRound.tsx
  - PictureBoard.tsx
  - GenericRound.tsx
- **Timer.tsx** - ❌ Timer broadcasting moved to CoHostInterface

---

## 🔄 Broadcast Flow

```
CoHostInterface → useQuizSync → broadcastAction → Supabase → 
useQuizSync system → Store updates → MainDisplay/Round Components read from store
```

**Key Point:** Only ONE component broadcasts, ALL others just read from the store.

---

## 📋 Current Component Status

| Component | useQuizSync Status | Notes |
|-----------|-------------------|-------|
| CoHostInterface.tsx | ✅ Calls useQuizSync | Only broadcaster |
| MainDisplay.tsx | ✅ No useQuizSync | Reader only |
| OnlyConnect.tsx | ✅ No useQuizSync | Reader only |
| WorldRankings.tsx | ✅ No useQuizSync | Reader only |
| F1GrandPrix.tsx | ✅ No useQuizSync | Reader only |
| OneMinuteRound.tsx | ✅ No useQuizSync | Reader only |
| PictureBoard.tsx | ✅ No useQuizSync | Reader only |
| GenericRound.tsx | ✅ No useQuizSync | Reader only |
| Timer.tsx | ✅ No useQuizSync | Broadcasting moved to CoHostInterface |

---

## 🧪 Testing Checklist

Before deploying changes that affect sync:

### Only Connect Round:
- [ ] Start with 1 clue revealed
- [ ] Each click reveals exactly 1 clue
- [ ] No double-reveal issues
- [ ] Answer visible to co-host only
- [ ] Points update correctly (5→3→2→1)

### Timer Sync:
- [ ] Timer starts/stops correctly on both displays
- [ ] Timer ticks sync properly
- [ ] No interference with other actions

### Other Rounds:
- [ ] World Rankings still works
- [ ] Picture Board still works
- [ ] F1 Grand Prix still works
- [ ] Generic Rounds still work

### Co-host Controls:
- [ ] All controls work properly
- [ ] State syncs to main display
- [ ] No double-actions

---

## 🔧 Common Mistakes to Avoid

### ❌ DON'T: Add useQuizSync to new round components
```tsx
// WRONG - This creates another channel
import { useQuizSync } from '@/hooks/useQuizSync';

export const NewRound = () => {
  const { broadcastAction } = useQuizSync(false); // ❌ BAD
  // ...
};
```

### ✅ DO: Only read from store in round components
```tsx
// CORRECT - Just read from store
import { useQuizStore } from '@/store/quizStore';

export const NewRound = () => {
  const { someState } = useQuizStore(); // ✅ GOOD
  // ...
};
```

### ❌ DON'T: Add useQuizSync to MainDisplay
```tsx
// WRONG - MainDisplay should never broadcast
export const MainDisplay = () => {
  const { broadcastAction } = useQuizSync(false); // ❌ VERY BAD
  // ...
};
```

### ✅ DO: Only CoHostInterface broadcasts
```tsx
// CORRECT - Only CoHostInterface broadcasts
export const CoHostInterface = () => {
  const { broadcastAction } = useQuizSync(true); // ✅ GOOD
  // ...
};
```

---

## 🐛 Debugging Sync Issues

If you see double-actions or weird sync behavior:

1. **Check for multiple useQuizSync calls:**
   ```bash
   grep -r "useQuizSync" src/components/
   ```

2. **Verify only CoHostInterface is broadcasting:**
   - Look for multiple "Creating new channel..." logs
   - Check if actions are being received multiple times

3. **Test with browser dev tools:**
   - Open CoHost and Main Display in separate tabs
   - Watch console logs for duplicate broadcasts

---

## 📝 Development Guidelines

### When Adding New Features:

1. **State Changes:** If you need to sync new state, add the action to CoHostInterface
2. **New Round Components:** Never add useQuizSync, only read from store
3. **Timer Features:** Add timer broadcasting to CoHostInterface, not Timer component
4. **Testing:** Always test sync behavior with both displays open

### Code Review Checklist:

- [ ] No new useQuizSync calls outside CoHostInterface
- [ ] All state changes go through CoHostInterface broadcasting
- [ ] Round components only read from store
- [ ] Timer broadcasting is in CoHostInterface if needed

---

## 🚨 Emergency Fix

If sync issues occur in production:

1. **Immediate fix:** Remove any useQuizSync calls outside CoHostInterface
2. **Verify:** Check all components with `grep -r "useQuizSync" src/components/`
3. **Test:** Confirm only CoHostInterface appears in results
4. **Deploy:** Only after verification

---

**Remember:** This rule prevents the most common and frustrating sync bugs. When in doubt, DON'T add useQuizSync - ask first!
