# Debug Panel Minimize/Maximize Feature

## Overview
This feature adds minimize/maximize functionality to the debug panel in the co-host app, allowing users to toggle between a compact header view and the full debug interface. This provides better control over screen real estate while maintaining access to debugging features.

## Implementation Details

### State Management
- **`isDebugPanelMinimized` state**: Boolean state to track panel visibility
- **Toggle function**: Simple state toggle to switch between minimized/maximized states

### UI Changes
- **Toggle button**: Added minimize/maximize button in debug panel header
- **Visual indicators**: 
  - Minus icon (`-`) when panel is expanded (click to minimize)
  - Plus icon (`+`) when panel is minimized (click to expand)
- **Conditional rendering**: All debug content is conditionally rendered based on minimized state
- **Smooth transitions**: Button has hover effects and transitions for better UX

### User Experience
- **Space saving**: When minimized, panel takes up minimal space
- **Quick access**: Easy to toggle between states without losing functionality
- **Touch-friendly**: Button sized appropriately for mobile interaction
- **Visual consistency**: Styling matches existing design system

## How It Works

### State Management
```typescript
const [isDebugPanelMinimized, setIsDebugPanelMinimized] = useState(false);
```

### Toggle Button
```typescript
<button
  onClick={() => setIsDebugPanelMinimized(!isDebugPanelMinimized)}
  className="p-1 rounded-lg bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 transition-colors"
>
  {isDebugPanelMinimized ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
</button>
```

### Conditional Rendering
```typescript
{!isDebugPanelMinimized && (
  <>
    {/* All debug panel content */}
    {/* State Information */}
    {/* Round Jump Controls */}
    {/* Quick Actions */}
  </>
)}
```

## Features

### Minimized State
- **Compact header**: Only shows title, bug icon, and toggle button
- **Minimal space**: Reduces vertical space usage significantly
- **Quick expand**: Single click to restore full functionality

### Maximized State
- **Full functionality**: All debug features available
- **State information**: Game state, round info, question details
- **Round controls**: Jump to any round quickly
- **Quick actions**: Force show/hide answers, navigate rounds

### Visual Design
- **Consistent styling**: Matches existing UI components
- **Hover effects**: Visual feedback on interaction
- **Smooth transitions**: Professional feel
- **Mobile optimized**: Touch-friendly button size

## Usage

### Basic Usage
1. Locate the debug panel in co-host app (bottom section)
2. Click the minus (`-`) button to minimize the panel
3. Click the plus (`+`) button to expand the panel again
4. State persists during the session

### Use Cases
- **During gameplay**: Minimize to reduce screen clutter
- **Testing/Debugging**: Expand to access debug features
- **Presentation mode**: Minimize for cleaner interface
- **Development**: Keep expanded for easy access to tools

## Benefits

### Screen Space Management
- **Space efficient**: Minimized state uses minimal vertical space
- **Flexible layout**: Adapt to different screen sizes and needs
- **User control**: Users decide when to show/hide debug features

### Improved Workflow
- **Less distraction**: Minimize when not actively debugging
- **Quick access**: Instantly restore when needed
- **Clean interface**: Better focus on game controls when minimized

### Mobile Optimization
- **Touch friendly**: Button sized for mobile interaction
- **Responsive**: Works well on different screen sizes
- **Consistent UX**: Follows mobile design patterns

## Technical Implementation

### Component Structure
```
Debug Panel
├── Header (always visible)
│   ├── Title + Bug Icon
│   ├── "For testing only" text
│   └── Minimize/Maximize Toggle
└── Content (conditional)
    ├── State Information
    ├── Round Jump Controls
    └── Quick Actions
```

### CSS Classes
- `glass-card`: Consistent panel styling
- `p-1 rounded-lg`: Button styling
- `bg-secondary/20`: Background color
- `hover:bg-secondary/30`: Hover effect
- `transition-colors`: Smooth color transitions

## Files Modified
- `src/components/CoHostInterface.tsx`: Added minimize/maximize functionality

## Testing Checklist
- ✅ Toggle button appears in debug panel header
- ✅ Minus icon shows when panel is expanded
- ✅ Plus icon shows when panel is minimized
- ✅ Clicking toggle switches between states
- ✅ Content hides/shows correctly
- ✅ Hover effects work properly
- ✅ Mobile touch interactions work
- ✅ State persists during session

## Future Enhancements
- **Animation**: Smooth collapse/expand animations
- **Persistence**: Save minimized state in localStorage
- **Keyboard shortcuts**: Add hotkey for toggle
- **Auto-minimize**: Option to auto-minimize during gameplay
- **Resize handle**: Allow manual resizing instead of just toggle

## Related Features
- **Team name editing**: Also added in same development session
- **Chris Stadia fixes**: Bug fixes for card reveal and answer display
- **General UI improvements**: Enhanced co-host app usability
