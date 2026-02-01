# Display Requirements - 16:9 Aspect Ratio & Mobile Co-Host

## Overview

This document outlines the critical display requirements for the quiz application:
- **Main Display**: Must fit within 16:9 aspect ratio for TV screens without scrolling
- **Co-Host App**: Must be primarily designed for mobile devices

These requirements ensure proper functionality across the primary display environments.

## Core Requirements

### Main Display (TV)
- **Aspect Ratio**: 16:9 (widescreen TV standard)
- **No Scrolling**: All content must fit within the viewport
- **TV Compatibility**: Optimized for television viewing distances

### Co-Host App (Mobile)
- **Primary Platform**: Mobile devices (phones/tablets)
- **Touch Interface**: Optimized for touch interactions
- **Portrait Orientation**: Primarily designed for portrait mode
- **Responsive Design**: Must work across various mobile screen sizes

## Implementation Guidelines

### Main Display Layout Constraints
- Design all components to fit within 16:9 viewport dimensions
- Avoid content that extends beyond this ratio horizontally or vertically
- Ensure proper spacing and padding within the constrained area
- Test layouts to prevent overflow in both directions

### Co-Host App Mobile Design
- **Touch Targets**: Minimum 44px for buttons and interactive elements
- **Thumb Zones**: Place primary actions in easy-to-reach areas
- **Single Column Layout**: Prefer vertical scrolling over horizontal
- **Mobile-First**: Design for mobile, then scale up if needed
- **Gesture Support**: Implement swipe, tap, and long-press where appropriate

### Responsive Design
- Maintain aspect ratio across different screen sizes
- Use relative units (%, vh, vw) rather than fixed pixels where appropriate
- Implement proper scaling for text and UI elements
- Consider TV viewing distances when sizing elements

### Content Organization
- Prioritize important information within the visible area
- Use collapsible or tabbed interfaces for content-heavy sections
- Implement proper information hierarchy
- Avoid dense layouts that become unreadable at TV distances

## Component-Specific Requirements

### Main Display Components
- **MainDisplay.tsx**: Must enforce 16:9 ratio at the root level
- **GenericRound.tsx**: Questions and answers must fit within 16:9
- **OnlyConnect.tsx**: Grid layouts must respect aspect ratio
- **WorldRankings.tsx**: Tables and lists must be scrollable within bounds
- **F1GrandPrix.tsx**: Track graphics and positioning must fit
- **OneMinuteRound.tsx**: Timer and question display must be properly sized
- **PictureBoard.tsx**: Image grids must maintain aspect ratio

### Co-Host App Components
- **CoHostInterface.tsx**: Must be mobile-optimized with touch-friendly controls
- **Timer Controls**: Large, easily accessible buttons for mobile use
- **Round Management**: Simple, clear interface for mobile screens
- **Score Keeping**: Easy input methods for mobile devices
- **Question Display**: Clear, readable text on mobile screens

### UI Elements
- **Timer Components**: Must be visible without overflow
- **Score Displays**: Should fit within designated areas
- **Question Text**: Must be readable at TV viewing distances
- **Answer Lists**: Should scroll internally if needed

## Testing Checklist

### Main Display Visual Testing
- [ ] Verify no horizontal scrolling on 16:9 displays
- [ ] Verify no vertical scrolling on 16:9 displays
- [ ] Check all round types fit properly within viewport
- [ ] Test with actual TV display when possible

### Co-Host App Mobile Testing
- [ ] Test on various mobile devices (phones/tablets)
- [ ] Verify touch targets are easily accessible
- [ ] Check portrait orientation functionality
- [ ] Test with different screen sizes and resolutions
- [ ] Verify gesture support works correctly
- [ ] Test one-handed usability where possible

### Responsive Testing
- [ ] Test different screen sizes maintaining 16:9 ratio
- [ ] Verify text remains readable at various scales
- [ ] Check UI elements don't overlap or become unusable
- [ ] Ensure proper touch/click target sizes

### Content Testing
- [ ] Verify long questions don't overflow
- [ ] Check large answer lists handle properly
- [ ] Test with maximum content scenarios
- [ ] Ensure all interactive elements remain accessible

## Development Best Practices

### CSS Guidelines for Main Display
```css
/* Use aspect-ratio property where supported */
.main-display {
  aspect-ratio: 16/9;
  width: 100%;
  max-height: 56.25vw; /* 9/16 * 100 */
}

/* For containers that might overflow */
.scrollable-content {
  max-height: 100%;
  overflow-y: auto;
}
```

### CSS Guidelines for Co-Host App
```css
/* Mobile-first responsive design */
.co-host-interface {
  min-height: 100vh;
  padding: 1rem;
  font-size: 16px; /* Prevent zoom on iOS */
}

/* Touch-friendly buttons */
.mobile-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

### Component Design
#### Main Display
- Always test with maximum expected content
- Use flexbox and grid for responsive layouts
- Implement proper error boundaries
- Consider loading states within the constrained area

#### Co-Host App
- Design for touch-first interactions
- Use mobile-friendly UI patterns (bottom sheets, modals)
- Implement proper loading states for mobile networks
- Consider offline functionality where possible

### Performance Considerations
#### Main Display
- Optimize images and media for 16:9 display
- Minimize layout shifts during content loading
- Use efficient rendering for dynamic content
- Test performance on lower-powered TV devices

#### Co-Host App
- Optimize for mobile network conditions
- Minimize JavaScript bundle size
- Use efficient touch event handling
- Test on lower-end mobile devices

## Common Issues and Solutions

### Main Display Issues

#### Content Overflow
**Problem**: Content extends beyond 16:9 viewport
**Solution**: 
- Implement internal scrolling for content areas
- Use `clamp()` for responsive font sizes
- Break up large content into manageable sections

#### Text Readability
**Problem**: Text too small to read from TV distance
**Solution**:
- Use larger minimum font sizes
- Increase contrast ratios
- Consider line height and spacing

#### Interactive Elements
**Problem**: Buttons or controls become unusable
**Solution**:
- Maintain minimum touch target sizes
- Ensure proper spacing between interactive elements
- Test with actual remote control or input method

### Co-Host App Mobile Issues

#### Touch Target Size
**Problem**: Buttons too small for reliable touch interaction
**Solution**:
- Use minimum 44px touch targets
- Add adequate spacing between buttons
- Consider thumb reach zones for primary actions

#### Mobile Performance
**Problem**: Slow loading or laggy interactions on mobile
**Solution**:
- Optimize images for mobile bandwidth
- Use efficient touch event handling
- Implement proper loading states

#### Orientation Changes
**Problem**: Layout breaks when rotating device
**Solution**:
- Test both portrait and landscape orientations
- Use flexible layouts that adapt to screen changes
- Consider locking to portrait if appropriate

## Future Considerations

### Display Evolution
- Monitor for new TV standards and resolutions
- Consider 4K/8K display compatibility
- Plan for different aspect ratios if needed

### Accessibility
#### Main Display
- Ensure compliance with TV accessibility standards
- Test with screen readers and other assistive technologies
- Consider color contrast and visual impairments

#### Co-Host App
- Follow mobile accessibility guidelines (WCAG)
- Test with mobile screen readers (VoiceOver, TalkBack)
- Ensure proper touch accessibility for users with motor impairments

### Performance Optimization
#### Main Display
- Optimize for TV hardware limitations
- Consider network constraints for media content
- Implement efficient caching strategies

#### Co-Host App
- Optimize for mobile battery life
- Consider offline functionality
- Implement efficient data synchronization

## Related Documentation

- [Sync Architecture](./sync-architecture.md) - For understanding display synchronization
- [Round Management](./round-management.md) - For round-specific display considerations
- [Testing Guide](./testing-guide.md) - For comprehensive testing procedures

---

**Last Updated**: 2026-02-01  
**Priority**: Critical - All display modifications must respect these requirements
