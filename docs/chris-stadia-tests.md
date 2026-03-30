# Chris Stadia Two-Stage Watch Card Reveal - Test Suite

This document outlines the comprehensive test suite for the Chris Stadia two-stage watch card reveal system. The tests verify all the complex state management and user interactions.

## Test Files Created

### 1. Component Tests (`src/components/rounds/__tests__/ChrisStadia.test.tsx`)
Tests the ChrisStadia component rendering and behavior.

### 2. Integration Tests (`src/components/__tests__/CoHostInterface.ChrisStadia.test.tsx`)
Tests the CoHostInterface integration with Chris Stadia controls.

### 3. Store Tests (`src/store/__tests__/ChrisStadia.integration.test.ts`)
Tests the quiz store state management.

### 4. Sync Tests (`src/hooks/__tests__/useQuizSync.ChrisStadia.test.ts`)
Tests the useQuizSync integration.

## Test Coverage Areas

### Basic Rendering Tests
- ✅ Renders Chris Stadia cards correctly
- ✅ Shows loading state when no question
- ✅ Does not render when transitioning
- ✅ Shows unrevealed cards with placeholder text
- ✅ Shows revealed cards with stadium names
- ✅ Shows visit type icons for revealed cards

### Watch Card Reason Display Tests
- ✅ Shows "Bonus available" for revealed watch cards when showAnswer is false
- ✅ Shows actual reasons for watch cards when showAnswer is true
- ✅ Shows reasons for watch cards when they are in chrisStadiaWatchShownOnScreen
- ✅ Shows reasons for all watch cards when showAnswer is true regardless of watchShownOnScreen

### Non-Watch Card Behavior Tests
- ✅ Shows reasons for non-watch cards when showAnswer is true
- ✅ Does not show reasons for non-watch cards when showAnswer is false

### Complex State Interaction Tests
- ✅ Handles mixed card types with different reveal states
- ✅ Maintains watch card reasons when showAnswer toggles

### CoHost Interface Integration Tests
- ✅ Displays Chris Stadia card controls when in Chris Stadia round
- ✅ Shows card reveal buttons for unrevealed cards
- ✅ Shows revealed state for already revealed cards
- ✅ Reveals watch card reason when watch card is clicked
- ✅ Clears watch reasons when non-watch card is clicked
- ✅ Resets showAnswer when new card is clicked
- ✅ Replaces watch reason with new watch card reason when different watch card is clicked

### Show On Screen Button Behavior Tests
- ✅ Adds all revealed watch reasons to shown on screen when showAnswer is toggled on
- ✅ Clears shown on screen when showAnswer is toggled off

### Answer Section Integration Tests
- ✅ Shows watch card reason in answer section when watch card is clicked
- ✅ Shows multiple watch card reasons when multiple are revealed
- ✅ Clears answer section when non-watch card is clicked
- ✅ Shows no answer when no watch cards are revealed

### Reset Functionality Tests
- ✅ Resets all Chris Stadia state when reset button is clicked

### Store State Management Tests
- ✅ Has correct initial Chris Stadia state
- ✅ Sets revealed cards correctly
- ✅ Adds cards to revealed list without duplicates
- ✅ Clears revealed cards when reset
- ✅ Sets watch revealed cards correctly
- ✅ Replaces watch reasons with new list
- ✅ Clears watch reasons when set to empty array
- ✅ Sets watch shown on screen cards correctly
- ✅ Adds cards to shown on screen list
- ✅ Clears shown on screen when set to empty array
- ✅ Resets all Chris Stadia state together
- ✅ Manages each state independently

### Complex Workflow Tests
- ✅ Handles complete watch card workflow
- ✅ Handles showAnswer toggle with multiple watch cards
- ✅ Maintains watchShownOnScreen when showAnswer resets
- ✅ Accumulates watchShownOnScreen when showAnswer is toggled multiple times

### Sync Integration Tests
- ✅ Handles revealChrisStadiaCard action
- ✅ Handles resetChrisStadia action
- ✅ Handles revealChrisStadiaWatchReason action with card IDs
- ✅ Handles revealChrisStadiaWatchReason action with undefined card IDs
- ✅ Handles revealChrisStadiaWatchShownOnScreen action with card IDs
- ✅ Handles revealChrisStadiaWatchShownOnScreen action with empty array
- ✅ Resets Chris Stadia state on nextQuestion
- ✅ Resets Chris Stadia state on previousQuestion
- ✅ Resets Chris Stadia state on goToQuestion

### Edge Cases Tests
- ✅ Handles empty cards array
- ✅ Handles missing visitType gracefully
- ✅ Handles missing reason gracefully
- ✅ Handles empty state correctly
- ✅ Handles single card operations
- ✅ Handles large card numbers
- ✅ Handles malformed data gracefully
- ✅ Handles missing data properties

## Key Test Scenarios

### Complete User Workflow
1. Navigate to Chris Stadia round
2. Click watch card → Card reveals, reason appears in answer section
3. Click "Show On Screen" → Reason appears on main display
4. Click different card → Answer section resets, showAnswer resets
5. Click another watch card → New reason appears in answer section
6. Click "Show On Screen" → All watch card reasons appear on main display

### State Persistence Tests
- Verify that watchShownOnScreen persists when showAnswer resets
- Verify that card reveals persist across state changes
- Verify that watch reasons in answer section reset appropriately

### Reset Behavior Tests
- Verify that reset button clears all Chris Stadia state
- Verify that question navigation resets Chris Stadia state
- Verify that full game reset clears Chris Stadia state

## Running the Tests

```bash
# Run all Chris Stadia tests
npm test -- --run --reporter=verbose ChrisStadia

# Run specific test files
npm test -- --run src/components/rounds/__tests__/ChrisStadia.test.tsx
npm test -- --run src/components/__tests__/CoHostInterface.ChrisStadia.test.tsx
npm test -- --run src/store/__tests__/ChrisStadia.integration.test.ts
npm test -- --run src/hooks/__tests__/useQuizSync.ChrisStadia.test.ts
```

## Test Data

The tests use the following mock data:

```typescript
const mockChrisStadiaCards = [
  {
    id: 1,
    stadium: 'Old Trafford',
    visitType: 'watch',
    reason: 'Manchester United vs Liverpool'
  },
  {
    id: 2,
    stadium: 'Wembley',
    visitType: 'work',
    reason: 'England vs Germany'
  },
  {
    id: 3,
    stadium: 'Camp Nou',
    visitType: 'watch',
    reason: 'Barcelona vs Real Madrid'
  },
  {
    id: 4,
    stadium: 'Anfield',
    visitType: 'not_visited',
    reason: 'Liverpool vs Chelsea'
  }
];
```

## Expected Behavior Summary

### When Watch Card is Clicked
1. Card reveals on main display with "Bonus available"
2. Reason appears immediately in co-host answer section
3. "Show On Screen" button is in "Show" state
4. Other cards maintain their current state

### When "Show On Screen" is Clicked
1. All revealed watch card reasons appear on main display
2. Button changes to "Hide"
3. Answer section continues to show current card's reason
4. Previously shown watch card reasons are tracked for persistence

### When New Card is Clicked
1. New card reveals (if not already revealed)
2. "Show On Screen" button resets to "Show" state
3. Answer section updates:
   - If watch card: Shows only this card's reason
   - If non-watch card: Clears answer section
4. Previously shown watch card reasons persist on main display

## Architecture Compliance Verified

The tests verify that:
- ✅ Only CoHostInterface broadcasts Chris Stadia actions
- ✅ Round components only read from store, no direct state changes
- ✅ All actions properly synchronized through useQuizSync
- ✅ State resets correctly on question navigation
- ✅ Single broadcast source prevents duplicates

This comprehensive test suite ensures that the complex two-stage watch card reveal system works correctly and maintains proper state management across all user interactions.
