# Ellie's Tellies - Technical Guide

## Overview
Ellie's Tellies is a picture-based quiz round where contestants identify sports personalities, events, locations, and dates from TV screen images.

## Technical Architecture

### Component Structure
- **Main Component**: `src/components/rounds/ElliesTellies.tsx`
- **Data Source**: `src/data/questions.json` (key: `"ellies-tellies"`)
- **Hook**: `src/hooks/useQuestions.ts` (handles question loading)
- **Images**: `/public/images/ellies-tellies/`

### Question Format
```json
{
  "id": "et-1",
  "type": "picture",
  "content": "Name both sports personalities, event, location (city and country), and month and year.",
  "imageUrl": "/images/ellies-tellies/telly1.png",
  "answer": [
    "Sportstar 1: Mélanie de Jesus dos Santos",
    "Sportstar 2: Ellie Downie", 
    "Event: Gymnastics European All-Around Championships",
    "Location: Cluj-Napoca, Romania",
    "Date: April 2017"
  ]
}
```

### Key Features
- **CRT Static Effect**: Authentic TV static animation when loading images
- **Image Transitions**: Static effect between questions (4.5s animation)
- **Responsive Layout**: Image centered, slides left when answer revealed
- **16:9 Aspect Ratio**: Maintains TV display compatibility

## Adding/Amending Questions

### 1. Add New Images
Place images in `/public/images/ellies-tellies/` with descriptive names:
- `telly5.png`, `telly6.png`, etc.

### 2. Add Question Entry
In `src/data/questions.json`, under `"ellies-tellies"` → `"questions"`:

```json
{
  "id": "et-5",
  "type": "picture",
  "content": "Name both sports personalities, event, location (city and country), and month and year.",
  "imageUrl": "/images/ellies-tellies/telly5.png",
  "answer": [
    "Sportstar 1: [Name]",
    "Sportstar 2: [Name]", 
    "Event: [Event Name]",
    "Location: [City, Country]",
    "Date: [Month Year]"
  ]
}
```

### 3. Update IDs
- Use sequential IDs: `et-5`, `et-6`, etc.
- Ensure unique IDs across all questions

### 4. Image Requirements
- **Format**: PNG preferred
- **Size**: Optimized for web (max 2MB)
- **Aspect Ratio**: Should fit within TV frame
- **Content**: Clear sports imagery with identifiable elements

## Animation System

### Image Loading
1. Initial load: 4.5s static-to-clear animation
2. Between questions: Static burst → new image reveal
3. Answer reveal: Image slides left/scales down, answer slides right

### Timing
- Static effect: 4.5 seconds
- Image transition: 0.8 seconds
- Answer reveal: 0.8s + 0.4s stagger

## Troubleshooting

### Common Issues
1. **Images not loading**: Check file paths in `imageUrl`
2. **Animation not working**: Verify `isImageTransitioning` state
3. **Layout breaking**: Ensure 16:9 aspect ratio maintained

### Testing
- Test on different screen sizes
- Verify all animations complete smoothly
- Check image quality on TV displays

## Future Improvements (Backlog)
- Refine static transition effects
- Add sound effects for transitions (timer sounds already implemented locally)
- Optimize image loading performance
- Enhance CRT authenticity

## File Locations
- Component: `src/components/rounds/ElliesTellies.tsx`
- Questions: `src/data/questions.json`
- Images: `public/images/ellies-tellies/`
- Hook: `src/hooks/useQuestions.ts`
