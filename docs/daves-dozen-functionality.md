# Dave's Dozen Round - Complete Functionality Documentation

## Overview
Dave's Dozen is an auction-style round where teams bid on how many answers they think they can correctly identify from a list of 12 items. The round features a 4x3 grid of numbered boxes that reveal images when answers are selected by the co-host.

## Architecture
- **Component**: `DavesDozen.tsx`
- **Store Integration**: Uses `davesDozenRevealedAnswers` Set and `davesDozenShowRedCross` boolean
- **Co-host Controls**: Answer selection grid in `CoHostInterface.tsx`
- **Sync**: Follows single broadcast source pattern (only CoHostInterface calls useQuizSync)

## Main Display Features

### Visual Layout
- **Question Display**: Large centered text at top of screen
- **Grid Layout**: 4 columns × 3 rows (12 boxes total)
- **Box Design**: 
  - Landscape aspect ratio (`aspect-video`) for optimal image display
  - Responsive sizing with `max-h-[28vh] md:max-h-[30vh]`
  - Glass card styling with rounded corners
- **Number Badges**: Purple circles in top-right corner (1-12)
- **QLAF Branding**: Shows in unrevealed boxes
- **Image Display**: Full-box images with `object-contain` fitting

### Responsive Design
- **Mobile**: 3 columns to fit smaller screens
- **Desktop**: 4 columns for optimal layout
- **Viewport Constraints**: 75vh max height for grid container
- **Touch-Friendly**: Appropriate sizing for mobile interaction

### State Management
- **Revealed Answers**: Tracked in `davesDozenRevealedAnswers` Set
- **Red Cross Overlay**: Controlled by `davesDozenShowRedCross` boolean
- **Transition Handling**: Component returns null during `isTransitioning`
- **Round State**: Only renders when `gameState === 'round'`

## Co-Host App Features

### Answer Selection Grid
- **Layout**: 4×3 grid matching main display
- **Answer Buttons**: Text-only (no numbers) with player/team names
- **Mobile Optimization**: Touch-friendly buttons with proper spacing
- **Positioning**: Above scores for better accessibility

### Control Actions
- **Reveal Answer**: `syncedRevealDavesDozenAnswer(answerNumber)`
- **Show Incorrect**: `syncedShowIncorrectAnswer()` - displays red cross
- **Reset Round**: `syncedResetDavesDozen()` - clears all reveals
- **Hidden Answer Section**: Answer display hidden for Dave's Dozen (mobile optimization)

## Question Data Structure

### Format (questions.json)
```json
{
  "daves-dozen": {
    "title": "Dave's Dozen",
    "questions": [
      {
        "id": "dd-1",
        "type": "auction",
        "content": "Question text here",
        "answers": [
          {
            "number": 1,
            "text": "Answer text",
            "imageUrl": "/images/daves-dozen/image.png"
          }
        ]
      }
    ]
  }
}
```

### Answer Properties
- **number**: 1-12 (box position)
- **text**: Display name for co-host app
- **imageUrl**: Path to image file for main display

## User Experience Flow

### Setup
1. Navigate to Dave's Dozen round
2. Question appears on main display
3. Co-host sees 4×3 grid of answer options
4. 12 QLAF-branded boxes show on main display

### Gameplay
1. Team gives bid (how many answers they think they can get)
2. Co-host selects answers to reveal one by one
3. Each revealed box shows image instead of QLAF branding
4. Number badges help track which answers have been revealed
5. Red cross overlay can be shown for incorrect answers

### Completion
1. All 12 answers revealed or time expires
2. Co-host can reset round to clear all reveals
3. Next round advancement through CoHostInterface

## Technical Implementation

### Component Structure
```typescript
export const DavesDozen = () => {
  const { davesDozenRevealedAnswers, davesDozenShowRedCross } = useQuizStore();
  const { currentQuestion } = useQuestions();
  
  // Grid rendering with conditional reveal logic
  // Image error handling with fallback
  // Responsive design classes
};
```

### Store Actions
```typescript
// In quizStore.ts
revealDavesDozenAnswer: (answerNumber: number) => {
  const newRevealed = new Set(davesDozenRevealedAnswers);
  newRevealed.add(answerNumber);
  set({ davesDozenRevealedAnswers: newRevealed });
}

showIncorrectAnswer: () => {
  set({ davesDozenShowRedCross: true });
}

resetDavesDozen: () => {
  set({ 
    davesDozenRevealedAnswers: new Set(),
    davesDozenShowRedCross: false 
  });
}
```

### Broadcast Actions
```typescript
// In CoHostInterface.tsx
const syncedRevealDavesDozenAnswer = (answerNumber: number) => {
  broadcastAction('revealDavesDozenAnswer', { answerNumber });
};

const syncedShowIncorrectAnswer = () => {
  broadcastAction('showIncorrectAnswer');
};

const syncedResetDavesDozen = () => {
  broadcastAction('resetDavesDozen');
};
```

## Testing

### Test Coverage
- **Component Rendering**: Question display, grid layout, box states
- **State Integration**: Store property usage, mock handling
- **User Interactions**: Answer reveals, reset functionality
- **Responsive Design**: Mobile/desktop layouts
- **Error Handling**: Missing questions, image loading errors
- **Edge Cases**: Transitions, empty states

### Test Files
- `src/__tests__/daves-dozen.test.ts` - Component and integration tests

## Current Questions

### Active Questions
1. **dd-1**: "Name every goalscorer for Tottenham in their successful Europa League run"
   - 12 Tottenham goalscorers with player images
   - Tests knowledge of recent football achievements

2. **dd-2**: "Name every current Scottish Premiership team"  
   - 12 Scottish football clubs with team crests
   - Tests knowledge of current league composition

### Future Questions (Backlog Item)
- Premier League Golden Boot winners
- England cricket World Cup winners  
- F1 drivers with multiple championships
- Olympic sports with British gold medalists
- Tennis Grand Slam winners by nationality
- Rugby World Cup winning captains

## Files Modified

### Core Implementation
- `src/components/rounds/DavesDozen.tsx` - Main display component
- `src/components/CoHostInterface.tsx` - Co-host controls and answer grid
- `src/components/MainDisplay.tsx` - Component import and mapping
- `src/store/quizStore.ts` - State management and actions

### Data Files
- `src/data/questions.json` - Question and answer data

### Test Files
- `src/__tests__/daves-dozen.test.ts` - Component and integration tests

### Documentation
- `docs/daves-dozen-functionality.md` - This file
- `docs/backlog.md` - Enhancement request added

## Browser Compatibility

### Image Handling
- **Fallback**: `/placeholder.svg` on image load errors
- **Error Logging**: Console error on failed image loads
- **Object Fit**: `object-contain` preserves aspect ratio

### Responsive Behavior
- **Viewport Units**: `vh` (viewport height) for consistent sizing
- **Breakpoints**: Mobile (`cols-3`) to Desktop (`md:cols-4`)
- **Touch Targets**: Minimum 44px for mobile accessibility

## Architecture Compliance

### ✅ Single Broadcast Source
- Only CoHostInterface calls `useQuizSync` and broadcasts actions
- MainDisplay and DavesDozen component only read from store
- No duplicate sync channels or race conditions

### ✅ Display Requirements
- Main display maintains 16:9 aspect ratio
- All content fits within viewport without scrolling
- Co-host app optimized for mobile devices

### ✅ State Management
- Clean separation of concerns
- Predictable state updates through store actions
- Proper handling of async data loading

## Troubleshooting

### Common Issues
1. **Images Not Showing**: Check image paths in questions.json
2. **Reveals Not Working**: Verify store actions and broadcast sync
3. **Layout Issues**: Check responsive classes and viewport constraints
4. **Test Failures**: Mock setup may need updating for new features

### Debug Commands
```bash
# Check component rendering
npm test -- daves-dozen

# Verify all tests
npm test

# Check specific functionality
# Look for console logs in browser dev tools
# Verify network requests for images
```

## Deployment Notes

### Branch: `feature/daves-dozen`
### Status: Ready for production
### Features Complete:
- ✅ Main display grid layout with responsive design
- ✅ Co-host answer selection interface  
- ✅ Image reveal functionality with error handling
- ✅ Store integration and sync architecture
- ✅ Mobile-optimized co-host controls
- ✅ Question data structure for 2 active questions
- ✅ Documentation and test coverage

## Future Enhancements

### From Backlog
- Add more question variety (6+ additional questions planned)
- Enhanced animations for answer reveals
- Sound effects for correct/incorrect answers
- Timer integration for auction-style bidding
- Team scoring integration for auction mechanics
