# GameCard Components Documentation

## Overview

The GameCard component system provides reusable, styled card components for consistent UI across all quiz rounds. These components feature glass morphism styling, smooth animations, and flexible props for different use cases.

## Components

### 1. GameCard (Base Component)

The foundational card component with glass effect and basic animations.

**Props**: `BaseGameCardProps`
```typescript
interface BaseGameCardProps {
  children: React.ReactNode;
  revealed?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}
```

**Features**:
- Glass morphism styling with `glass-card` class
- Aspect ratio constraint (`aspect-video`)
- Responsive padding and sizing
- Basic scale and opacity animations on reveal
- Touch-friendly cursor pointer

**Usage**:
```tsx
<GameCard revealed={false} onClick={handleClick}>
  <div>Card content</div>
</GameCard>
```

---

### 2. RevealGameCard

Enhanced card with flip animation, icon support, and dynamic styling for revealed/unrevealed states.

**Props**: `RevealGameCardProps`
```typescript
interface RevealGameCardProps extends BaseGameCardProps {
  icon?: React.ReactNode;
  iconAnimation?: boolean;
  borderColor?: string;
  backgroundColor?: string;
}
```

**Default Props**:
- `iconAnimation`: `true`
- `borderColor`: `'rgb(59 130 246 / 0.5)'` (blue)
- `backgroundColor`: `'bg-green-500/20 text-green-400 border-green-500/30'` (green theme)

**Animations**:
- **Flip Effect**: `rotateY: [0, 90, 0]` - Card flips 360° when revealed
- **Scale Pulse**: `scale: [1, 0.8, 1]` - Subtle pulse during reveal
- **Duration**: 0.6s with easeInOut timing
- **Icon Fade**: Icons appear with 0.2s delay after flip

**Dynamic Styling**:
- **Unrevealed**: Uses `bg-primary text-primary-foreground` (theme colors)
- **Revealed**: Uses custom `backgroundColor` and `borderColor` props
- **Border Delay**: Border appears 0.6s after reveal for smooth transition

**Usage Examples**:

```tsx
// Wipeout style - green for correct, red for incorrect
<RevealGameCard
  revealed={isRevealed}
  borderColor={isCorrect ? 'rgb(34 197 94 / 0.5)' : 'rgb(239 68 68 / 0.5)'}
  backgroundColor={isCorrect ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}
  icon={isRevealed ? <Check className="w-6 h-6" /> : null}
>
  {!isRevealed && <div>Answer text</div>}
</RevealGameCard>

// Chris Stadia style - custom icon with visit type
<RevealGameCard
  revealed={isRevealed}
  icon={<MapPin className="w-6 h-6" />}
  backgroundColor="bg-blue-500/20 text-blue-400 border-blue-500/30"
>
  <div>Stadium name</div>
</RevealGameCard>
```

---

### 3. ImageGameCard

Card optimized for displaying images with numbered overlays and error handling.

**Props**: `ImageGameCardProps`
```typescript
interface ImageGameCardProps extends BaseGameCardProps {
  imageUrl: string;
  imageAlt: string;
  number?: number;
}
```

**Features**:
- Numbered overlay when not revealed (top-right corner)
- Responsive image sizing with `object-contain`
- Fallback to `/placeholder.svg` on image error
- Rounded overflow container for revealed images

**Usage**:
```tsx
<ImageGameCard
  revealed={isRevealed}
  imageUrl="/images/countries/flag.png"
  imageAlt="Country flag"
  number={1}
>
  {isRevealed && <div>Additional content</div>}
</ImageGameCard>
```

---

### 4. TextGameCard

Simple card for displaying text content with customizable typography.

**Props**: `TextGameCardProps`
```typescript
interface TextGameCardProps extends BaseGameCardProps {
  text: string;
  fontSize?: 'text-md' | 'text-lg' | 'text-2xl' | 'text-3xl';
  fontWeight?: 'font-medium' | 'font-bold';
}
```

**Default Props**:
- `fontSize`: `'text-md'`
- `fontWeight`: `'font-medium'`

**Typography Classes**:
- Base: `text-md md:text-base font-medium text-center text-primary-foreground`
- Dynamic sizing based on `fontSize` prop
- Bold text when `fontWeight` is `'font-bold'`

**Usage**:
```tsx
<TextGameCard
  text="Answer option"
  fontSize="text-lg"
  fontWeight="font-bold"
  revealed={isRevealed}
/>
```

---

## Styling System

### Glass Morphism

All cards use the `glass-card` class which provides:
- Translucent background with backdrop blur
- Subtle border effects
- Modern, premium appearance
- Consistent with QLAF design language

### Theme Integration

Cards automatically integrate with your theme:
- **Unrevealed State**: Uses `bg-primary text-primary-foreground`
- **Revealed State**: Uses custom colors via props
- **Responsive Design**: Mobile-first with md: breakpoints
- **Touch Targets**: Appropriate sizing for mobile interaction

### Animation System

**Base Animation** (GameCard):
```typescript
{
  initial: { opacity: 1, scale: 1 },
  animate: { 
    opacity: 1,
    scale: revealed ? [1, 0.8, 1] : 1,
    rotateY: revealed ? [0, 90, 0] : 0  // Only in RevealGameCard
  },
  transition: { duration: 0.6, ease: "easeInOut" }
}
```

**Content Animation** (RevealGameCard):
```typescript
{
  initial: { opacity: 1 },
  animate: { 
    opacity: revealed ? [1, 0, 0, 1] : 1
  },
  transition: { 
    duration: 0.8, 
    ease: "easeInOut",
    times: revealed ? [0, 0.3, 0.7, 1] : undefined
  }
}
```

## Migration Guide

### From Custom Card Implementation

**Before** (custom motion.div):
```tsx
<motion.div
  initial={{ opacity: 1, scale: 1 }}
  animate={{ opacity: 1, scale: isRevealed ? [1, 0.8, 1] : 1 }}
  className="aspect-video glass-card rounded-lg p-3 flex flex-col items-center justify-center"
>
  <div className="text-center">{content}</div>
</motion.div>
```

**After** (using GameCard):
```tsx
<TextGameCard
  text={content}
  revealed={isRevealed}
  fontSize="text-md"
  fontWeight="font-medium"
/>
```

### Benefits of Migration

1. **Consistency**: All cards have identical animations and styling
2. **Maintainability**: Card logic centralized in one location
3. **Reduced Code**: Eliminates duplicate styling and animation code
4. **Theme Integration**: Automatic use of QLAF theme colors
5. **Responsive Design**: Built-in mobile-friendly sizing and touch targets
6. **Error Handling**: Image cards include fallback behavior
7. **Testing**: Centralized components easier to test and maintain

## Best Practices

### Choosing the Right Component

- **RevealGameCard**: Use for cards that flip between hidden/revealed states
- **ImageGameCard**: Use for cards that primarily display images
- **TextGameCard**: Use for simple text-based cards
- **GameCard**: Use as base for custom card implementations

### Props Usage

- **Always provide** `data-testid` for testing
- **Use responsive props** like `fontSize` for mobile optimization
- **Leverage dynamic colors** via `borderColor` and `backgroundColor` props
- **Enable icon animation** for better user feedback

### Performance Considerations

- Cards use `will-change` optimizations via Framer Motion
- Images lazy-load with error boundaries
- Animations use GPU-accelerated transforms
- Minimal re-renders through proper prop usage

## File Structure

```
src/components/ui/GameCard.tsx
├── BaseGameCard (base component)
├── RevealGameCard (flip animations + icons)
├── ImageGameCard (image display + numbers)
└── TextGameCard (text content + typography)
```

## Testing

Components include comprehensive `data-testid` support:
- `GameCard`: Test basic card functionality
- `RevealGameCard`: Test flip animations and icon behavior
- `ImageGameCard`: Test image loading and error handling
- `TextGameCard`: Test typography and responsive sizing

Example test usage:
```tsx
<RevealGameCard data-testid="test-card" revealed={true}>
  <div>Test content</div>
</RevealGameCard>
```
