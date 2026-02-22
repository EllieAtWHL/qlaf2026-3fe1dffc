# Co-Host Interface Documentation

## Overview

The Co-Host Interface is a companion control panel for the QLAF 2026 quiz application that allows a co-host to manage the quiz flow, control questions, manage scores, and synchronize with the main display. It provides real-time control over all aspects of the quiz while maintaining sync with the main presentation display.

## Technical Implementation

### Architecture

The Co-Host Interface is built as a React component using:
- **React** with TypeScript for component structure
- **Zustand** for state management (shared with main display)
- **Framer Motion** for animations
- **Custom hooks** for quiz synchronization and question management
- **Tailwind CSS** for styling with custom QLAF theme

### Key Components

#### 1. State Management (`useQuizStore`)

The interface shares state with the main display through Zustand store:

```typescript
interface QuizState {
  gameState: 'welcome' | 'round' | 'round-transition' | 'scores' | 'final';
  currentRoundIndex: number;
  currentQuestionIndex: number;
  isTimerRunning: boolean;
  timerValue: number;
  teams: Team[];
  showAnswer: boolean;
  // ... other state
}
```

#### 2. Synchronization (`useQuizSync` hook)

Real-time synchronization between co-host and main display:

```typescript
const { broadcastAction } = useQuizSync(true);
```

- Uses WebSocket-like communication
- Broadcasts all actions to main display
- Ensures both interfaces stay in sync
- Handles connection status with visual indicators

#### 3. Question Management (`useQuestions` hook)

Handles question loading and navigation:

```typescript
const { 
  currentQuestion, 
  totalQuestions, 
  hasNextQuestion, 
  hasPreviousQuestion,
  getQuestionsForRound 
} = useQuestions();
```

### Component Structure

```typescript
export const CoHostInterface = () => {
  // State and hooks
  const { /* store methods */ } = useQuizStore();
  const { broadcastAction } = useQuizSync(true);
  const { /* question methods */ } = useQuestions();
  
  // Synced wrapper functions
  const syncedStartGame = () => {
    startGame();
    broadcastAction('startGame');
  };
  
  // UI sections
  return (
    <div>
      {/* Header */}
      {/* Quiz Control */}
      {/* Question Controls */}
      {/* Timer Management (auto-start logic, no UI) */}
      {/* Team Scores */}
      {/* F1 Controls */}
    </div>
  );
};
```

### UI Sections

#### 1. Header
- Shows "CO-HOST CONTROLS" title
- Connection status indicator (Synced/Offline)
- Reset game button

#### 2. Quiz Control Section
- **Start Game**: Initializes quiz and moves to first round
- **Play Round**: Starts current round (disabled when round is active)
- **Scores**: Shows scores screen (acts as pause/holding screen)
- **Round Indicator**: Shows current round number and name

#### 3. Question Controls (only visible when round is active)
- Question navigation (Previous/Next)
- Show/Hide answer toggle
- Question content preview
- Answer display when shown

#### 4. Timer Management (handled automatically)
- **Auto-start**: Timer automatically starts for Picture Board rounds
- **Control Actions**: Start/pause/reset broadcast to main display (no UI controls)
- **Visual Display**: Timer shown on main display only
- **Picture Board Auto-start**: Timer starts when first picture appears

#### 5. Team Scores
- Score adjustment controls (+/- buttons)
- Direct score input
- Total score display
- Round-specific score management

#### 6. F1 Controls (F1 Grand Prix round only)
- Car position advancement
- Percentage-based progress
- Team-specific controls

### State Flow

1. **welcome** → Initial state, shows "Start Game"
2. **round-transition** → Round title display, shows "Play Round"
3. **round** → Active round, shows questions, disables "Play Round"
4. **scores** → Score display, enables "Play Round" again

### Synchronization Pattern

All user actions follow this pattern:
```typescript
const syncedAction = () => {
  // Update local state immediately
  localAction();
  // Broadcast to main display
  broadcastAction('actionName', { data });
};
```

## User Guide

### Getting Started

1. **Open the Co-Host Interface** - Navigate to the co-host URL or open on tablet/device
2. **Check Connection** - Ensure "Synced" status is showing in header
3. **Start Quiz** - Click "Start Game" to begin

### Quiz Flow

#### Starting a Round
1. Click **"Play Round"** to begin the current round
2. The button will change to **"Round In Progress"** and become disabled
3. Question controls will appear automatically

#### Managing Questions
1. **Navigate Questions**: Use "Prev" and "Next" buttons
2. **Show Answers**: Click "Show" to reveal answer, "Hide" to conceal
3. **Auto-advance**: "Next" button automatically moves to next round when questions are complete

#### Using Timer (automatic behavior)
1. **Auto-start**: Timer automatically starts for Picture Board rounds when first picture appears
2. **Visual Display**: Timer countdown is shown on main display only
3. **No Controls**: Timer management is handled automatically by the system
4. **Picture Board**: Timer starts automatically when team selects board and first picture shows

#### Managing Scores
1. **Adjust Scores**: Use +/- buttons for quick adjustments
2. **Direct Input**: Type exact scores in input fields
3. **Round-specific**: Scores are tracked per round

#### Using Scores as Pause Screen
- Click **"Scores"** anytime to pause and show current standings
- This serves as a holding screen during breaks
- Click **"Play Round"** to resume the round

### Round Types and Special Features

#### Standard Rounds
- Question navigation and answer reveal
- Timer controls (if applicable)
- Score management

#### F1 Grand Prix (Final Round)
- All standard features plus:
- **Car Position Controls**: Advance team positions by 5% or 10%
- **Visual Progress**: Shows percentage completion for each team

### Best Practices

#### During Live Quiz
1. **Keep questions hidden** until ready to reveal
2. **Use scores screen** for natural breaks and transitions
3. **Monitor timer** closely for timed rounds
4. **Double-check scores** before finalizing

#### Troubleshooting
1. **Connection Lost**: Check "Synced" status, refresh if needed
2. **Round Not Starting**: Ensure previous round was properly completed
3. **Score Issues**: Use direct input for precise adjustments

### Button Reference

| Button | Purpose | When Available |
|--------|---------|----------------|
| Start Game | Initialize quiz | Welcome state only |
| Play Round | Start current round | Not during active round |
| Round In Progress | Status indicator | During active round |
| Scores | Show score screen | Always available |
| Prev/Next | Navigate questions | During active round |
| Show/Hide | Toggle answer visibility | During active round |
| +/- | Adjust scores | Always available |
| +5%/+10% | Advance F1 cars | F1 round only |

### Keyboard Shortcuts

Currently, the interface is optimized for touch/tablet use. Keyboard shortcuts could be added for desktop use if needed.

### Multi-Device Support

The Co-Host Interface is designed to work on:
- Tablets (primary use case)
- Mobile phones
- Desktop computers
- Any device with modern web browser

### Performance Considerations

- **Real-time sync**: Minimal latency for action broadcasting
- **Responsive design**: Adapts to different screen sizes
- **Touch-friendly**: Large buttons for easy interaction
- **Battery conscious**: Minimal background processing

## Development Notes

### Adding New Features

1. **Store Actions**: Add to Zustand store first
2. **Sync Wrapper**: Create synced version with broadcast
3. **UI Integration**: Add to appropriate section
4. **State Logic**: Update visibility/enablement logic

### Styling Guidelines

- Use `glass-card` class for sections
- Use `control-btn` class for buttons
- Follow QLAF color scheme (`qlaf-success`, `qlaf-gold`, etc.)
- Maintain consistent spacing and typography

### Testing

- Test synchronization with main display
- Verify all button states and transitions
- Check responsive behavior on different devices
- Validate score calculations and timer accuracy

This documentation provides a comprehensive understanding of both the technical implementation and practical usage of the Co-Host Interface for the QLAF 2026 quiz application.
