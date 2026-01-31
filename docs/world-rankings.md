# World Rankings Round Documentation

## Overview

The World Rankings round is an interactive quiz round where players rank items (players, teams, etc.) in the correct order. When answers are revealed, the items animate into their correct positions with smooth transitions.

## Features

- **Animated Reordering**: Items smoothly animate to their correct positions when answers are shown
- **Image Display**: Each item can have an associated image
- **Two-line Labels**: Support for main label and sublabel (e.g., player name and team information)
- **Answer Details**: Shows the specific answer value (e.g., transfer fee, points scored) when revealed
- **Responsive Design**: Works on both main display and co-host interface

## How It Works

### Question Structure

Each World Rankings question follows this structure in `questions.json`:

```json
{
  "id": "wr-1",
  "type": "ranking",
  "content": "Rank these football transfers by fee (lowest to highest)",
  "options": [
    {
      "label": "Player Name",
      "sublabel": "Team Transfer Info",
      "imageUrl": "/images/player-image.png",
      "order": 1,
      "answer": "£100,000"
    }
  ]
}
```

### Properties Explained

- **`id`**: Unique identifier (format: `wr-{number}`)
- **`type`**: Always set to `"ranking"`
- **`content`**: The question text displayed to players
- **`options`**: Array of items to be ranked

#### Option Properties

- **`label`** (required): Main text displayed (e.g., player name)
- **`sublabel`** (optional): Secondary text displayed below label (e.g., team transfer info)
- **`imageUrl`** (optional): Path to image file in `public/images/`
- **`order`** (required): Correct ranking position (1 = first, 2 = second, etc.)
- **`answer`** (required): The answer value to display when revealed (e.g., transfer fee, points)

## Adding New Questions

### Step 1: Prepare Images

1. Add player/item images to the `public/images/` folder
2. Use descriptive filenames (e.g., `PlayerName.png`)
3. Recommended size: At least 400x400px for good quality

### Step 2: Add Question to JSON

Open `src/data/questions.json` and add your question to the `world-rankings` section:

```json
{
  "id": "wr-3",
  "type": "ranking", 
  "content": "Rank these NBA players by career points (highest to lowest)",
  "options": [
    {
      "label": "LeBron James",
      "sublabel": "Cleveland Cavaliers → Miami Heat → Los Angeles Lakers",
      "imageUrl": "/images/LeBronJames.png",
      "order": 1,
      "answer": "38,652 points"
    },
    {
      "label": "Kobe Bryant", 
      "sublabel": "Los Angeles Lakers",
      "imageUrl": "/images/KobeBryant.png",
      "order": 2,
      "answer": "33,643 points"
    }
  ]
}
```

### Step 3: Test

1. Start the quiz application
2. Navigate to the World Rankings round
3. Test the question navigation and answer reveal
4. Verify images display correctly
5. Check that animations work smoothly

## Best Practices

### Content Guidelines

- **Keep questions focused**: Rank items by a single clear metric (fee, points, goals, etc.)
- **Use consistent formatting**: For monetary values, use consistent currency symbols and formats
- **Limit to 4-6 items**: Too many items can make the display crowded
- **Clear sublabels**: Use sublabels to provide context (teams, years, etc.)

### Image Guidelines

- **Consistent sizing**: Try to use images with similar aspect ratios
- **Good quality**: Use high-resolution images for better display
- **Transparent backgrounds**: PNGs with transparency work best
- **Appropriate content**: Ensure images are suitable for your audience

### Order Logic

- **Order 1**: First position (highest/lowest depending on question)
- **Order 2**: Second position
- **And so on...**
- **Make sure order numbers are unique and sequential**

## Technical Implementation

### Components Used

- **`WorldRankings.tsx`**: Main component handling display and animations
- **`useQuestions.ts`**: Hook for question data management
- **`quizStore.ts`**: State management for quiz flow
- **`useQuizSync.ts`**: Real-time synchronization between displays

### Animation Details

The reordering animation uses `framer-motion` with these features:
- Smooth position transitions
- Staggered animations for visual appeal
- Maintains item identity during reordering
- Responsive to different screen sizes

### State Management

- Questions are loaded dynamically based on current round
- `showAnswer` state controls whether items are in random or correct order
- `currentQuestionIndex` tracks which question is being displayed
- Real-time sync ensures co-host and main display stay synchronized

## Troubleshooting

### Common Issues

**Questions not loading:**
- Check JSON syntax for commas and brackets
- Verify `type` is set to `"ranking"`
- Ensure all required properties are present

**Images not displaying:**
- Verify image paths are correct and files exist in `public/images/`
- Check image file extensions (.png, .jpg, .jpeg)
- Ensure image filenames match exactly (case-sensitive)

**Animations not working:**
- Check browser console for JavaScript errors
- Verify `framer-motion` is properly imported
- Test in different browsers if needed

**Co-host sync issues:**
- Ensure both displays are on the same network
- Check browser console for sync errors
- Verify Supabase connection is working

## Example Questions

### Football Transfers
```json
{
  "id": "wr-4",
  "type": "ranking",
  "content": "Rank these Premier League transfers by fee (lowest to highest)",
  "options": [
    {
      "label": "Moisés Caicedo",
      "sublabel": "Brighton → Chelsea",
      "imageUrl": "/images/MoisesCaicedo.png",
      "order": 3,
      "answer": "£115,000,000"
    }
  ]
}
```

### Sports Statistics
```json
{
  "id": "wr-5", 
  "type": "ranking",
  "content": "Rank these tennis players by Grand Slam titles (most to least)",
  "options": [
    {
      "label": "Novak Djokovic",
      "sublabel": "Serbia",
      "imageUrl": "/images/NovakDjokovic.png", 
      "order": 1,
      "answer": "24 titles"
    }
  ]
}
```

## Future Enhancements

Potential improvements to consider:
- Sound effects for animations
- Image zoom functionality
- Export/import question sets
