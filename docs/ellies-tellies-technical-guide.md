# Ellie's Tellies - Technical Guide

## Overview
Ellie's Tellies is a picture-based quiz round where contestants identify sports personalities, events, locations, and dates from TV screen images with authentic CRT static effects and smooth transitions.

## 🎯 Current Status (February 2026)
**Status**: ✅ **Fully Implemented & Tested**
- All TV static transitions working perfectly
- Image positioning and sizing optimized
- Comprehensive test suite (76 tests passing)
- Responsive design maintained
- Performance optimized

---

## Technical Architecture

### Component Structure
- **Main Component**: `src/components/rounds/ElliesTellies.tsx`
- **Data Source**: `src/data/questions.json` (key: `"ellies-tellies"`)
- **Hook**: `src/hooks/useQuestions.ts` (handles question loading)
- **Images**: `/public/images/ellies-tellies/`
- **Tests**: `src/__tests__/ellies-tellies.test.tsx`

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

---

## 🎨 Visual Features

### TV Frame Design
- **Frame Image**: `/images/ellies-tellies/tvFrame.png`
- **Screen Positioning**: `w-[81%] h-[91%]` with `-ml-1` offset
- **Max Width**: `max-w-3xl` for responsive scaling
- **Vertical Alignment**: `pt-8 -mt-4` for perfect TV screen fit

### CRT Static Effect System
- **Multiple Layers**: Fast flickering, scanlines, slow noise, white flashes
- **Animation Duration**: 2 seconds for smooth transitions
- **Realistic Timing**: Different animation speeds for authentic TV feel
- **CSS Keyframes**: Custom `scanlines` animation in `src/index.css`

### Image Transition System
1. **Static Appears**: Immediate when question changes
2. **Static Duration**: 500ms of pure TV static
3. **Image Reveals**: 2-second transition from static to clear image
4. **Static Fades**: Synchronized with image completion
5. **Exit Animation**: Image transitions back to static when changing questions

### Loading & Error States
- **Loading**: "Tuning Channel..." with spinner (TV theme)
- **Error**: "Signal Lost" + "Unable to load image" (TV theme)
- **Fallback**: `/placeholder.svg` for missing images

---

## 🧪 Test Coverage

### Comprehensive Test Suite (76 tests)
- ✅ **TV frame and screen rendering**
- ✅ **Question display and progress tracking**
- ✅ **Image loading states and error handling**
- ✅ **Static transition animations**
- ✅ **Component conditional rendering**
- ✅ **Missing image fallbacks**
- ✅ **Responsive behavior**
- ✅ **Mock store integration**

### Test Commands
```bash
# Run all Ellie's Tellies tests
npm test -- ellies-tellies

# Run with coverage
npm test -- ellies-tellies --coverage
```

---

## 🔧 Implementation Details

### State Management
```typescript
const [isImageTransitioning, setIsImageTransitioning] = useState(false);
const [displayedImage, setDisplayedImage] = useState(currentQuestion?.imageUrl || '/placeholder.svg');
const [isImageLoading, setIsImageLoading] = useState(false);
const [imageError, setImageError] = useState(false);
```

### Static Effect Timing
```typescript
// Question change trigger
setIsImageTransitioning(true);
setTimeout(() => {
  setDisplayedImage(currentQuestion.imageUrl);
  setTimeout(() => {
    setIsImageTransitioning(false);
  }, 2000); // Match image transition duration
}, 500); // Static duration before image appears
```

### Image Animation
```typescript
<motion.img
  initial={{ 
    opacity: 0,
    filter: 'brightness(0) contrast(5) saturate(0) blur(2px)',
  }}
  animate={{ 
    opacity: 1,
    filter: 'brightness(1) contrast(1) saturate(1) blur(0px)',
  }}
  exit={{
    opacity: 0,
    filter: 'brightness(0) contrast(5) saturate(0) blur(2px)',
  }}
  transition={{ duration: 2, ease: "easeInOut" }}
/>
```

---

## 📁 File Structure

```
src/
├── components/
│   └── rounds/
│       └── ElliesTellies.tsx          # Main component (397 lines)
├── __tests__/
│   └── ellies-tellies.test.tsx        # Test suite (207 lines)
├── hooks/
│   └── useQuestions.ts                # Question data hook
├── data/
│   └── questions.json                 # Question database
└── index.css                          # Static animation CSS

public/
└── images/
    └── ellies-tellies/
        ├── tvFrame.png               # TV frame image
        └── telly*.png                # Question images
```

---

## 🚀 Adding New Questions

### 1. Add New Images
Place images in `/public/images/ellies-tellies/` with descriptive names:
- `telly8.png`, `telly9.png`, etc.

### 2. Add Question Entry
In `src/data/questions.json`, under `"ellies-tellies"` → `"questions"`:

```json
{
  "id": "et-8",
  "type": "picture",
  "content": "Name both sports personalities, event, location (city and country), and month and year.",
  "imageUrl": "/images/ellies-tellies/telly8.png",
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
- Use sequential IDs: `et-8`, `et-9`, etc.
- Ensure unique IDs across all questions

### 4. Image Requirements
- **Format**: PNG preferred
- **Size**: Optimized for web (max 2MB)
- **Aspect Ratio**: Should fit within TV frame (tested with current positioning)
- **Content**: Clear sports imagery with identifiable elements

---

## 🎛️ Configuration Options

### Screen Positioning (Current Settings)
```tsx
<div className="relative w-[81%] h-[91%] max-w-3xl overflow-hidden bg-black shadow-2xl border-4 border-gray-800 -ml-1">
```

### Available Adjustments
- **Width**: Change `w-[81%]` to adjust screen width
- **Height**: Change `h-[91%]` to adjust screen height
- **Horizontal Position**: Adjust `-ml-1` (negative margin left)
- **Vertical Position**: Adjust `pt-8 -mt-4` in parent container
- **Max Width**: Change `max-w-3xl` for different responsive breakpoints

---

## 🔍 Troubleshooting

### Common Issues & Solutions

1. **Images not loading**
   - Check file paths in `imageUrl`
   - Verify images exist in `/public/images/ellies-tellies/`
   - Check browser network tab for 404 errors

2. **Static animation not working**
   - Verify `isImageTransitioning` state changes
   - Check CSS animations in `src/index.css`
   - Ensure Framer Motion is properly imported

3. **Layout breaking on different screens**
   - Test responsive behavior with `max-w-3xl` setting
   - Adjust width/height percentages if needed
   - Verify TV frame image scales properly

4. **Tests failing**
   - Check mock data matches Question interface
   - Verify all required properties in mock store
   - Ensure text expectations match component output

### Performance Considerations
- Images are preloaded for smooth transitions
- Static effects use CSS animations for performance
- Component properly cleans up timers and listeners

---

## 🧬 Development Notes

### Key Technical Decisions
1. **Separate TV Frame**: Frame image separate from screen content for precise positioning
2. **AnimatePresence**: Used for smooth exit animations when changing questions
3. **CSS Static Effects**: Multiple layers for authentic CRT appearance
4. **Responsive Design**: Percentage-based sizing with max-width constraints
5. **Mock Structure**: Comprehensive test mocks covering all store properties

### Recent Improvements (February 2026)
- ✅ Fixed static timing and synchronization
- ✅ Optimized screen positioning within TV frame
- ✅ Added comprehensive test coverage
- ✅ Improved error handling and fallbacks
- ✅ Enhanced responsive behavior
- ✅ Refined animation timing for realistic TV feel

---

## 📋 Testing Checklist

### Manual Testing
- [ ] Verify TV frame displays correctly on all screen sizes
- [ ] Test static transitions between questions
- [ ] Check image loading states and error handling
- [ ] Verify responsive behavior on mobile/tablet/desktop
- [ ] Test with slow network connections
- [ ] Verify all question images load properly

### Automated Testing
- [ ] Run `npm test -- ellies-tellies` - should pass 76 tests
- [ ] Check test coverage remains high
- [ ] Verify no TypeScript errors
- [ ] Ensure linting passes

---

## 🔮 Future Enhancements

### Potential Improvements (Backlog)
- Add sound effects for static transitions
- Enhance CRT authenticity with screen curvature effect
- Add more sophisticated static patterns
- Implement image lazy loading for better performance
- Add keyboard navigation support
- Enhance accessibility features

### Technical Debt
- Consider extracting static effect to reusable component
- Optimize image compression further
- Add error boundary for better error handling

---

## 📞 Support

### Files to Modify for Common Changes
- **Questions**: `src/data/questions.json`
- **Styling**: `src/components/rounds/ElliesTellies.tsx`
- **Animations**: `src/index.css` (static keyframes)
- **Tests**: `src/__tests__/ellies-tellies.test.tsx`

### Quick Test Command
```bash
npm test -- ellies-tellies --watch
```

---

**Last Updated**: February 22, 2026  
**Version**: 2.0 (Fully Tested & Optimized)  
**Status**: ✅ Production Ready
