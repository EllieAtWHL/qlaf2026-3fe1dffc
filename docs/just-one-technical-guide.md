# Just One Round - Technical Guide

## Overview

The "Just One" round is a simple question-answer format where contestants need to provide one valid answer from a predefined list of possible answers. The round displays the question and reveals all possible answers when the host chooses to show them.

## Data Structure

### Location
All Just One questions are stored in `/src/data/questions.json` under the `"just-one"` key.

### Question Format

```json
{
  "id": "jo-1",
  "type": "single", 
  "content": "Name a British gold medalist from the last Summer or Winter Olympics (41)",
  "answer": [
    {"name": "Alex Yee", "event": "Triathlon - Men's Individual"},
    {"name": "Bryony Page", "event": "Gymnastics - Women's Trampoline"}
    // ... more answers
  ]
}
```

### Fields Explained

- **`id`**: Unique identifier following the pattern `jo-{number}`
- **`type`**: Always `"single"` for Just One questions
- **`content`**: The question text. Include the answer count in parentheses for reference
- **`answer`**: Array of valid answers. Can be:
  - Simple string array: `["Tennis", "Badminton", "Squash"]`
  - Object array with additional data: `[{"name": "Alex Yee", "event": "Triathlon"}]`

## Display Logic

### Main Display (`/src/components/rounds/GenericRound.tsx`)

The display handles two different answer formats:

1. **Simple String Answers**: Displays as comma-separated text
2. **Object Answers**: Shows in a grid layout with enhanced formatting

#### Object Answer Display
- **Large lists (>3 items)**: Scrollable single-column grid with auto-scroll
- **Small lists (≤3 items)**: Vertical list layout
- **Each item shows**: Name (prominent) + additional data (smaller text)
- **Auto-scroll**: For >3 items, automatically scrolls down and up (8 seconds each direction)

### Co-host Display (`/src/components/CoHostInterface.tsx`)

For co-host interface, only the names are extracted from object answers:
```typescript
currentQuestion.answer.map(answer => 
  typeof answer === 'object' && answer !== null ? answer.name : answer
).join(', ')
```

## Adding New Questions

### Step 1: Choose an ID
Find the next available ID by checking existing questions:
- Current IDs: `jo-1`, `jo-2`, `jo-3`, `jo-4`, `jo-5`
- Next ID would be: `jo-6`

### Step 2: Add the Question

Add to the `questions` array in `/src/data/questions.json`:

```json
{
  "id": "jo-6",
  "type": "single",
  "content": "Name a [category] ([count])",
  "answer": [
    // Your answers here
  ]
}
```

### Step 3: Choose Answer Format

#### Simple Format (for basic lists)
```json
"answer": ["Tennis", "Badminton", "Squash", "Table Tennis"]
```

#### Enhanced Format (for detailed information)
```json
"answer": [
  {"name": "Alex Yee", "event": "Triathlon - Men's Individual"},
  {"name": "Tom Dean", "event": "Swimming - Men's 200m Freestyle"}
]
```

### Step 4: Update Content Count
Include the answer count in parentheses in the content text:
- `"Name an NHL team (31)"`
- `"Name a British gold medalist from the last Summer or Winter Olympics (41)"`

## Best Practices

### Question Content
- Keep questions clear and specific
- Include the answer count for reference
- Use consistent formatting: "Name a [category] ([count])"

### Answer Organization
- **Alphabetical order**: Makes it easier to verify answers during the quiz
- **Consistent formatting**: Use proper capitalization
- **Complete lists**: Ensure all valid answers are included

### Object Format Usage
Use object format when you want to display additional information:
- Event details (Olympic events, sports venues)
- Descriptive data (player positions, team info)
- Context that enhances the main display

### Answer Count Thresholds
The display automatically adjusts based on answer count:
- **≤3 items**: Simple vertical list
- **>3 items**: Scrollable grid layout with auto-scroll animation
- **Auto-scroll timing**: 8 seconds down, 3 seconds pause, 8 seconds up
- Consider this when deciding how many answers to include

## Technical Implementation Details

### Type Safety
The system handles both string and object answers safely:
```typescript
const answerObj = typeof answer === 'object' ? answer : { name: answer, event: '' };
```

### Responsive Design
- **All list sizes**: Single-column grid for consistency
- **Auto-scroll**: Smooth 8-second animations for large lists
- **Text sizing**: Fixed sizing for readability during scroll
- **16:9 aspect ratio**: Maintained for TV compatibility

### Performance
- Efficient rendering with React keys
- Custom scroll animations using requestAnimationFrame
- Optimized for large answer lists (40+ items)
- Auto-scroll prevents manual scrolling requirements

## Current Questions

1. **jo-1**: Sports played with a racket (5 answers)
2. **jo-2**: British Olympic gold medalists (41 answers) - Enhanced format
3. **jo-3**: NHL teams (31 answers)
4. **jo-4**: Cricket test countries (12 answers)
5. **jo-5**: Women's heptathlon events (7 answers)

## Troubleshooting

### Common Issues

1. **"[object Object]" in co-host display**
   - Ensure object answers have proper structure
   - Check null handling in co-host component

2. **Display overflow**
   - Large lists automatically become scrollable with auto-scroll
   - Auto-scroll timing: 8 seconds down, 3 seconds pause, 8 seconds up
   - Check `max-h-56` setting in GenericRound.tsx for scroll container

3. **TypeScript errors**
   - Ensure proper null checks for object answers
   - Verify answer array structure

### Testing
- Test both simple and object answer formats
- Verify co-host interface shows names only
- Check responsive behavior on different screen sizes
- Test with various answer counts (small and large lists)
- **Test auto-scroll**: Verify smooth scrolling for >3 answers
- **Test thresholds**: Confirm layout changes at 3-item threshold
