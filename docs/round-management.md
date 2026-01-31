# Round Management Guide

This guide explains how rounds are managed in the QLAF 2026 quiz application and how to work with them.

## Overview

Rounds in the QLAF app are now managed through JSON configuration files, making them easy to modify without touching the codebase. There are two main components:

- **`/src/data/rounds.json`** - Contains round metadata and configuration
- **`/src/data/questions.json`** - Contains the actual questions for each round

## Round Configuration Structure

Each round in `rounds.json` has the following properties:

```json
{
  "id": "world-rankings",
  "name": "World Rankings", 
  "description": "Rank items in order",
  "timerDuration": null,
  "isTeamRound": true,
  "component": "WorldRankings",
  "icon": "Globe"
}
```

### Property Explanations

- **`id`**: Unique identifier (must match the key in `questions.json`)
- **`name`**: Display name shown in the UI
- **`description`**: Brief description shown on round transition screens
- **`timerDuration`**: Timer duration in seconds, or `null` for no timer
- **`isTeamRound`**: `true` for team rounds, `false` for individual rounds
- **`component`**: React component name to render for this round
- **`icon`**: Lucide React icon name for round transitions

## Available Components

The following round components are available:

| Component Name | Description | Requires Special Props |
|---|---|---|
| `GenericRound` | Standard question/answer format | `roundId` |
| `WorldRankings` | Ranking items in order | `roundId` |
| `PictureBoard` | Image identification round | `roundId` |
| `OneMinuteRound` | Timed quick-fire round | `roundId` |
| `F1GrandPrix` | Final F1-style race round | `roundId` |

## Available Icons

You can use any Lucide React icon name. Common icons used:

- `Globe`, `Users`, `Image`, `Link`, `RotateCcw`
- `Gavel`, `Tv`, `Calculator`, `Skull`, `Clock`, `Flag`

## Working with Rounds

### Adding a New Round

1. **Add to `rounds.json`**:
   ```json
   {
     "id": "my-new-round",
     "name": "My New Round",
     "description": "Description of my round",
     "timerDuration": 90,
     "isTeamRound": true,
     "component": "GenericRound",
     "icon": "Star"
   }
   ```

2. **Add questions to `questions.json`**:
   ```json
   {
     "my-new-round": {
       "title": "My New Round",
       "questions": [
         {
           "id": "mnr-1",
           "type": "single",
           "content": "What is 2+2?",
           "answer": "4"
         }
       ]
     }
   }
   ```

### Reordering Rounds

Simply change the order of rounds in the `rounds.json` array. The first round will be displayed first, second round second, etc.

```json
{
  "rounds": [
    {
      "id": "picture-board",  // This is now round 1
      "name": "Picture Board",
      ...
    },
    {
      "id": "world-rankings", // This is now round 2
      "name": "World Rankings", 
      ...
    }
  ]
}
```

### Modifying an Existing Round

Edit the properties directly in `rounds.json`:

- **Change timer**: Set `"timerDuration": 120` for 2 minutes
- **Change team/individual**: Set `"isTeamRound": false`
- **Change component**: Set `"component": "GenericRound"`
- **Change icon**: Set `"icon": "Users"`

### Removing a Round

1. Remove the round object from the `rounds.json` array
2. Optionally remove the corresponding questions from `questions.json`

## Round Types and Their Uses

### Team Rounds (`isTeamRound: true`)
- Multiple teams compete simultaneously
- Good for collaborative problem-solving
- Examples: World Rankings, Picture Board, Wipeout

### Individual Rounds (`isTeamRound: false`)
- Players compete individually
- Good for quick responses or personal knowledge
- Examples: Just One, Distinctly Average, Round Robin

### Timed Rounds (`timerDuration: number`)
- Creates urgency and excitement
- Good for quick-fire questions
- Examples: One Minute Round (60s), Picture Board (60s)

## Creating Custom Round Components

If you need a specialized round type beyond the available components:

1. **Create the component** in `/src/components/rounds/`:
   ```tsx
   // /src/components/rounds/MyCustomRound.tsx
   import { useQuizStore } from '@/store/quizStore';
   
   export const MyCustomRound = ({ roundId }: { roundId: string }) => {
     const { currentRoundIndex } = useQuizStore();
     
     return (
       <div className="min-h-screen qlaf-bg flex items-center justify-center">
         <h1>My Custom Round</h1>
         {/* Your custom round logic */}
       </div>
     );
   };
   ```

2. **Import and add to component map** in `MainDisplay.tsx`:
   ```tsx
   import { MyCustomRound } from '@/components/rounds/MyCustomRound';
   
   const componentMap: Record<string, React.ComponentType<any>> = {
     // ... existing components
     'MyCustomRound': MyCustomRound,
   };
   ```

3. **Use in rounds.json**:
   ```json
   {
     "id": "my-custom-round",
     "component": "MyCustomRound",
     // ... other properties
   }
   ```

## Question Integration

Each round automatically loads questions from `questions.json` based on the `id` field. The system:

1. Matches `round.id` from `rounds.json` with the key in `questions.json`
2. Loads the `questions` array for that round
3. Makes questions available through the `useQuestions` hook

## Best Practices

### Round IDs
- Use kebab-case (e.g., `my-awesome-round`)
- Keep them descriptive and unique
- Match exactly between `rounds.json` and `questions.json`

### Component Naming
- Use PascalCase for component names (e.g., `MyCustomRound`)
- Keep component names consistent with the round purpose
- Default to `GenericRound` for standard Q&A rounds

### Timer Duration
- `null` = no timer (default)
- `60` = 1 minute
- `120` = 2 minutes
- Consider the complexity of questions when setting timers

### Testing Changes
1. Always test round transitions
2. Verify questions load correctly
3. Check that timers work as expected
4. Ensure team/individual logic is correct

## Troubleshooting

### Round Not Loading
- Check that the `component` name matches exactly in `MainDisplay.tsx`
- Verify the component is imported and added to `componentMap`
- Ensure the round ID exists in both JSON files

### Questions Not Loading
- Verify the round `id` matches exactly between `rounds.json` and `questions.json`
- Check that the questions array is properly formatted
- Ensure question IDs are unique within each round

### Icons Not Displaying
- Check that the icon name matches a Lucide React icon
- Verify the icon is spelled correctly (case-sensitive)
- Ensure the icon is imported in `RoundTransition.tsx`

## Migration from Hardcoded Rounds

Previously, rounds were hardcoded in `quizStore.ts`. The migration to JSON provides:

- ✅ Easy modification without code changes
- ✅ Non-technical users can manage rounds
- ✅ Version control friendly changes
- ✅ Consistent with questions.json approach
- ✅ All existing functionality preserved

## Future Enhancements

Potential improvements to round management:

- Round categories or tags
- Conditional round logic (e.g., "if score > X, show bonus round")
- Round difficulty levels
- Dynamic round selection based on team preferences
- Round templates for easy duplication
