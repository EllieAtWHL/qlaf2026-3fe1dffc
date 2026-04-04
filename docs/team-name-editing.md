# Team Name Editing Feature

## Overview
This feature allows co-host users to edit team names directly in the co-host app, with real-time synchronization to the main display. Team names persist throughout the game session and update wherever team names are displayed.

## Implementation Details

### Store Changes
- **`updateTeamName` function**: Added to quiz store interface and implementation
- **Sync action**: Added `updateTeamName` to useQuizSync hook for broadcasting changes

### CoHostInterface Changes
- **State management**: Added `teamNameInputs` state to track team name inputs
- **Initialization**: Automatically initializes team name inputs when teams change
- **Sync function**: Added `handleTeamNameChange` that updates local state, store, and broadcasts changes
- **UI update**: Replaced static team names with editable input fields

### User Experience
- **Editable fields**: Team names are now editable text inputs with clean border design
- **Real-time sync**: Changes immediately sync to the main display
- **Mobile-friendly**: Inputs are touch-optimized with proper styling
- **Visual feedback**: Border highlights on focus for better UX

## How It Works

### State Flow
1. **User types** → `handleTeamNameChange` called
2. **Local update** → `teamNameInputs` state updated
3. **Store update** → `updateTeamName` called
4. **Broadcast** → `updateTeamName` action broadcast via useQuizSync
5. **Main display update** → All components using team names update automatically

### UI Implementation
```typescript
<input
  type="text"
  value={teamNameInputs[team.id] || team.name}
  onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
  className="font-display text-sm flex-1 bg-transparent border-b border-border/50 focus:border-primary outline-none px-1 py-0.5 text-foreground"
  placeholder="Team name"
/>
```

## Features

### Editing
- **Inline editing**: Click on team name to edit directly
- **Real-time updates**: Changes appear immediately on main display
- **Persistent**: Names persist across rounds and game state changes

### Synchronization
- **Instant sync**: Changes broadcast to main display in real-time
- **Architecture compliant**: Only CoHostInterface broadcasts actions
- **Consistent state**: All displays show the same team names

### Mobile Optimization
- **Touch-friendly**: Appropriate input sizes for mobile devices
- **Visual feedback**: Clear focus states and hover effects
- **Clean design**: Minimal borders that don't interfere with UI

## Usage

### Basic Usage
1. Navigate to the "Round Scores" section in co-host app
2. Click on any team name input field
3. Type the new team name
4. Changes automatically sync to main display

### Best Practices
- **Clear naming**: Use descriptive team names for better gameplay
- **Consistent length**: Keep names reasonably short for display purposes
- **Real-time updates**: See changes immediately on main display

## Technical Implementation

### Store Interface
```typescript
interface QuizState {
  // ... existing properties
  updateTeamName: (teamId: number, name: string) => void;
}
```

### Store Implementation
```typescript
updateTeamName: (teamId: number, name: string) => {
  const { teams } = get();
  const updatedTeams = teams.map(team => {
    if (team.id === teamId) {
      return { ...team, name };
    }
    return team;
  });
  set({ teams: updatedTeams });
}
```

### Sync Handler
```typescript
case 'updateTeamName': {
  const teamsForNameUpdate = [...store.teams];
  const teamToNameUpdate = teamsForNameUpdate.find(t => t.id === data.teamId);
  if (teamToNameUpdate) {
    teamToNameUpdate.name = data.name;
    useQuizStore.setState({ teams: teamsForNameUpdate });
  }
  break;
}
```

## Architecture Compliance

✅ **Single Broadcast Source**: Only CoHostInterface broadcasts team name updates  
✅ **Proper Sync Flow**: CoHostInterface → useQuizSync → broadcast → store update → MainDisplay  
✅ **State Management**: Clean separation of local input state and global team state  
✅ **No Direct Store Access**: MainDisplay only reads from store, never broadcasts

## Files Modified
- `src/store/quizStore.ts`: Added updateTeamName function
- `src/hooks/useQuizSync.ts`: Added updateTeamName sync handler
- `src/components/CoHostInterface.tsx`: Added editable team name inputs and sync logic

## Testing Checklist
- ✅ Team name inputs appear correctly in scoring section
- ✅ Typing updates team names in real-time
- ✅ Changes sync to main display immediately
- ✅ Names persist across round changes
- ✅ Mobile touch interactions work properly
- ✅ Focus states and styling are appropriate

## Future Enhancements
- **Character limits**: Add reasonable character limits for team names
- **Validation**: Prevent empty team names
- **History**: Track team name changes for debugging
- **Presets**: Offer common team name presets
