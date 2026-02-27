# GenericRound Component Documentation

## Overview

The `GenericRound` component is a versatile, reusable component that handles multiple round types in the QLAF quiz application. It provides a consistent interface for displaying questions, answers, and handling different answer formats while maintaining the 16:9 aspect ratio requirement for TV displays.

## Supported Round Types

The GenericRound component handles the following round types:

### 1. Just One
- **Round ID**: `just-one`
- **Description**: "Give a unique answer"
- **Gameplay**: Individual players provide unique answers, avoiding duplicates
- **Answer Format**: Array of objects with `name` and `event` properties

### 2. Round Robin
- **Round ID**: `round-robin`
- **Description**: "Take turns answering"
- **Gameplay**: Players take turns giving answers until someone gets one wrong, repeats, or can't answer
- **Answer Format**: String or simple array

### 3. Distinctly Average
- **Round ID**: `distinctly-average`
- **Description**: "Guess the average"
- **Gameplay**: Players guess the a numerecial value with the average of the teams guesses being the final answer
- **Answer Format**: Number

## Technical Architecture

### Component Structure

```typescript
interface GenericRoundProps {
  roundId?: string; // Optional, reads from store by default
}
```

### Key Features

1. **Responsive Layout**: Maintains 16:9 aspect ratio for TV compatibility
2. **Animated Transitions**: Smooth question-to-answer animations
3. **Flexible Answer Display**: Handles multiple answer formats
4. **Timer Integration**: Supports timed rounds
5. **Scroll Management**: Auto-scroll for long answer lists

### Animation System

The component uses Framer Motion for smooth animations:

1. **Question Card Animation**: 
   - Slides up when answer is revealed (`y: "-200%"`)
   - 0.6s easeInOut transition
   - Maintains center position when answer is hidden

2. **Answer Card Animation**:
   - Slides up from below with fade-in
   - 0.2s delay for dramatic effect
   - Positioned at `top-56` (224px from top)

3. **Content Animations**:
   - Question content fades in with upward motion
   - Options animate in sequence with staggered delays

## Question Data Structure

### Basic Question Format

```json
{
  "id": "unique-question-id",
  "type": "single",
  "content": "Question text displayed to players",
  "answer": "Answer content",
  "points": 10
}
```

### Question with Options

```json
{
  "id": "question-with-options",
  "type": "single",
  "content": "Question with multiple choice options",
  "options": [
    {
      "label": "Option A text",
      "imageUrl": "/path/to/image.jpg" // Optional
    },
    {
      "label": "Option B text",
      "imageUrl": null
    }
  ],
  "answer": "Correct answer",
  "points": 10
}
```

### Question with Array Answers

```json
{
  "id": "question-with-array-answers",
  "type": "single",
  "content": "Question with multiple answers",
  "answer": [
    {
      "name": "Answer 1",
      "event": "Additional context"
    },
    {
      "name": "Answer 2",
      "event": "Additional context"
    }
  ],
  "points": 10
}
```

## Quizmaster Guide

### Adding New Questions

1. **Location**: `/src/data/questions.json`
2. **Structure**: Questions are organized by round ID

#### Just One Questions

```json
"just-one": {
  "title": "Just One",
  "questions": [
    {
      "id": "jo-1",
      "type": "single",
      "content": "Name a British gold medalist from the last Summer or Winter Olympics (41)",
      "answer": [
        {"name": "Alex Yee", "event": "Triathlon - Men's Individual"},
        {"name": "Keely Hodgkinson", "event": "Athletics - Women's 800m"}
      ]
    }
  ]
}
```

#### Round Robin Questions

```json
"round-robin": {
  "title": "Round Robin",
  "questions": [
    {
      "id": "rr-1",
      "type": "single",
      "content": "Which country hosted the 2022 FIFA World Cup?",
      "answer": "Qatar"
    }
  ]
}
```

#### Distinctly Average Questions

```json
"distinctly-average": {
  "title": "Distinctly Average",
  "questions": [
    {
      "id": "da-1",
      "type": "single",
      "content": "What is the average number of goals per game in the Premier League?",
      "answer": "1.4"
    }
  ]
}
```

### Question Guidelines

#### Content Standards
- **Clarity**: Questions should be unambiguous and easy to understand
- **Difficulty**: Mix of easy, medium, and hard questions
- **Length**: Keep questions concise but complete
- **Relevance**: Topics should be broadly known and interesting

#### Answer Formatting
- **Consistency**: Use consistent formatting for similar answer types
- **Completeness**: Include all necessary information
- **Accuracy**: Double-check all facts and figures
- **Events**: For sports questions, include event/context when relevant

### Image Guidelines

#### Option Images
- **Size**: Optimize for web (max 500px width)
- **Format**: JPG or PNG
- **Quality**: Clear and recognizable
- **Path**: `/public/images/[round-name]/`

#### File Naming
- **Format**: lowercase-with-hyphens.png
- **Examples**: `premier-league-badge.png`, `olympic-rings.jpg`

## Display Requirements

### 16:9 Aspect Ratio Compliance

The component maintains strict 16:9 aspect ratio for TV displays:

- **Container**: Uses `main-display-round` class with proper constraints
- **Content**: All content fits within viewport without scrolling
- **Responsive**: Adapts to different screen sizes while maintaining ratio

### Mobile Considerations

While primarily designed for TV display, the component remains functional on mobile:
- **Touch Targets**: Minimum 44px for interactive elements
- **Text Size**: Readable on smaller screens
- **Layout**: Stacks appropriately on narrow screens

## Testing

### Test Coverage

The component includes comprehensive tests covering:

1. **Basic Rendering**: Round info, questions, scoreboard
2. **Answer Display**: Different answer formats, points display
3. **Array Answers**: Grid vs list formatting
4. **Options Display**: With and without images
5. **Timer Integration**: Timed vs non-timed rounds
6. **State Handling**: Transitions, game states
7. **Animation**: Layout changes and transitions

### Running Tests

```bash
npm test src/__tests__/generic-round.test.tsx
```

### Manual Testing Checklist

1. **Display Test**: Verify 16:9 aspect ratio on TV
2. **Animation Test**: Check smooth question-to-answer transitions
3. **Answer Formats**: Test all answer types (string, array, objects)
4. **Timer Test**: Verify timer appears/disappears correctly
5. **Scroll Test**: Test auto-scroll for long answer lists
6. **Responsive Test**: Test on different screen sizes

## Integration

### Store Integration

The component integrates with the quiz store:

```typescript
const {
  currentRoundIndex,
  showAnswer,
  currentQuestionIndex,
  gameState,
  isTransitioning
} = useQuizStore();
```

### Questions Hook

Uses the `useQuestions` hook for question data:

```typescript
const {
  currentQuestion,
  totalQuestions
} = useQuestions();
```

### Architecture Compliance

- ✅ **No useQuizSync**: Component only reads from store
- ✅ **16:9 Ratio**: Maintains TV display requirements
- ✅ **Single Responsibility**: Handles display only
- ✅ **Error Handling**: Graceful handling of missing data

## Troubleshooting

### Common Issues

1. **Questions Not Loading**
   - Check question ID matches rounds.json
   - Verify questions.json structure
   - Check useQuestions hook integration

2. **Animation Issues**
   - Verify Framer Motion is working
   - Check CSS transitions
   - Test on different browsers

3. **Aspect Ratio Problems**
   - Check container classes
   - Verify viewport settings
   - Test on actual TV display

4. **Answer Display Issues**
   - Check answer format (string vs array)
   - Verify object structure for array answers
   - Test scrolling for long lists

### Debug Mode

Enable debug logging by setting environment variable:

```bash
VITE_DEBUG=true npm run dev
```

## Future Enhancements

### Planned Features

1. **Enhanced Animations**: More sophisticated transition effects
2. **Accessibility**: Improved screen reader support
3. **Performance**: Virtual scrolling for large answer lists
4. **Themes**: Support for different visual themes
5. **Export**: Print-friendly question/answer formats

### Extension Points

The component is designed for easy extension:

- **New Round Types**: Add to rounds.json and questions.json
- **Custom Animations**: Modify Framer Motion configurations
- **Answer Formats**: Extend answer handling logic
- **Layout Variations**: Add new layout modes

---

**Last Updated**: 2026-02-27  
**Version**: 1.0.0  
**Maintainer**: QLAF Development Team
