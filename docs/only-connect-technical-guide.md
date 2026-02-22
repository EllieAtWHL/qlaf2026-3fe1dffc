# Only Connect Round

## Overview

The Only Connect round is based on the BBC's "Only Connect" quiz show. Teams are given 4 clues (images or text) and must identify the connection that links them all together.

## Game Rules

- Players are shown **4 clues** that all connect to a common theme
- Clues are revealed **one at a time** in left-to-right, top-to-bottom order (2x2 grid)
- Players earn points based on how many clues they needed to solve it:
  - **5 points** - Correct after clue 1
  - **3 points** - Correct after clue 2
  - **2 points** - Correct after clue 3
  - **1 point** - Correct after clue 4
- All clues are controlled via the **Co-Host Interface** app

## Component Structure

### OnlyConnect.tsx

Located in `src/components/rounds/OnlyConnect.tsx`

#### Layout
- **Header**: Round title, points available, scoreboard
- **Question**: Connection question text
- **Grid**: 2x2 grid displaying 4 options (images or text)
  - Card dimensions: 366x327px (fixed aspect ratio)
  - Responsive image display with `object-contain`
  - Equal padding on all sides (24px)
- **Answer Display**: Slides in from the right when revealed
  - Smooth animation (0.6s duration, easeOut curve)
  - Images animate to accommodate the answer panel

#### Key Features

1. **Image Handling**
   - Supports both image URLs and text options
   - Images are centered within cards without cropping
   - Graceful error handling with fallback placeholder

2. **Animations**
   - Framer Motion for all transitions
   - Options fade in with staggered delay (0.1s between each)
   - Answer panel slides in from right with smooth layout shift
   - Images reposition smoothly as layout changes

3. **Responsive Design**
   - 2x2 grid centered on screen
   - Side-by-side layout: images left, answer right
   - Proper spacing and gap management

### State Management

Uses `useQuizStore()` hook:
- `currentRoundIndex` - Current round position
- `onlyConnectRevealedOptions` - Number of revealed options (0-4)
- `showAnswer` - Toggle answer display
- `revealOnlyConnectOption()` - Reveal next clue (called from CoHost)

## Question Data Structure

```json
{
  "id": "oc-1",
  "type": "connection",
  "content": "What connects these sports stars?",
  "options": [
    { "text": "Seth Curry", "imageUrl": "/images/only-connect/sethCurry.png" },
    { "text": "Simone Inzaghi", "imageUrl": "/images/only-connect/simoneInzaghi.png" },
    { "text": "Jonathan Brownlee", "imageUrl": "/images/only-connect/jonathanBrownlee.png" },
    { "text": "Eli Manning", "imageUrl": "/images/only-connect/eliManning.png" }
  ],
  "answer": "Younger sporting brothers who played against their older sibling."
}
```

### Field Requirements

- **id**: Unique identifier (format: `oc-N` where N is the question number)
- **type**: Must be `"connection"`
- **content**: The question prompt displayed to the audience
- **options**: Array of exactly 4 options
  - Each option should have `text` and/or `imageUrl`
  - `imageUrl` should point to files in `/public/images/only-connect/`
- **answer**: Description of the connection (5+ characters recommended)

## Image Guidelines

### Image Specifications
- **Dimensions**: 440x388px (landscape orientation)
- **Format**: PNG or JPG
- **Location**: `/public/images/only-connect/`
- **File naming**: Descriptive names (e.g., `sethCurry.png`, `simoneInzaghi.png`)

### Scaling
- Card size: 366x327px with 24px padding
- Images scale to fit using `object-contain`
- Maintains aspect ratio without cropping

## Co-Host Integration

The Only Connect round is controlled entirely from the Co-Host Interface:

- **Reveal Next Clue**: Advances `onlyConnectRevealedOptions` by 1
- **Show Answer**: Toggles `showAnswer` flag
- **Round Management**: Uses standard round transitions

No reveal button or manual controls appear on the main display.

## Testing

Tests are located in `src/__tests__/only-connect.test.ts`

Covers:
- Question structure validation
- Options structure validation
- Points system correctness
- Image URL format validation
- Content uniqueness and quality

Run tests with: `npm test only-connect`

## Known Limitations

- Currently supports 4-clue format only
- Placeholder images used for some questions
- No support for audio/video clues yet

## Future Enhancements

- Add more Only Connect questions to the database
- Implement partial reveal animations (fade individual options in)
- Add difficulty levels or themed question sets
- Support for special clue types (audio, video, cryptic text)
