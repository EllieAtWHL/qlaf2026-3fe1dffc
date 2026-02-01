# QLAF 2026 Testing Guide

This guide covers how to run tests, what tests currently exist, and what tests we should create.

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-reruns on file changes)
npm run test:watch

# Run specific test file
npm test src/__tests__/cohost-options-order.test.ts

# Run tests with coverage
npm test -- --coverage
```

### Test Configuration

- **Framework**: Vitest (modern Jest alternative)
- **Environment**: jsdom (browser-like environment)
- **Setup**: `src/test/setup.ts` (configures Testing Library and mocks)
- **Pattern**: Tests located in `src/**/*.{test,spec}.{ts,tsx}`

## 📁 Current Test Files

### 1. `src/__tests__/sync-architecture.test.ts`
**Type**: Documentation/Architecture Test  
**Purpose**: Ensures sync architecture follows correct patterns  
**Coverage**:
- Only CoHostInterface should call useQuizSync
- MainDisplay and round components should only read from store
- Timer should not broadcast (CoHostInterface handles timer sync)
- Prevents double-broadcast issues

### 2. `src/__tests__/cohost-options-order.test.ts`
**Type**: Regression Test  
**Purpose**: Prevents co-host options reordering bug  
**Coverage**:
- Options maintain A, B, C, D order regardless of state changes
- Reset button doesn't cause reordering
- Show/Hide answer toggle doesn't affect order
- Different option types (strings, objects, mixed)

### 3. `src/test/example.test.ts`
**Type**: Example Test  
**Purpose**: Basic test setup verification  
**Coverage**: Minimal placeholder test

## 🎯 Test Categories & Todo List

### 🔥 High Priority Tests to Create

#### Co-Host Interface Tests
- [ ] **Co-Host Controls Integration**
  - [ ] Test all buttons work correctly (Start Game, Next Round, etc.)
  - [ ] Test timer controls (start, pause, reset)
  - [ ] Test score adjustments
  - [ ] Test question navigation

- [ ] **Answer Display Logic**
  - [ ] Test always-visible answer section
  - [ ] Test Show/Hide On Screen button
  - [ ] Test different answer types (ranking, array, string)
  - [ ] Test points display

#### Round Component Tests
- [ ] **GenericRound Component**
  - [ ] Test question rendering
  - [ ] Test options display
  - [ ] Test answer reveal
  - [ ] Test timer integration

- [ ] **OnlyConnect Component**
  - [ ] Test progressive clue reveal
  - [ ] Test points system (5→3→2→1)
  - [ ] Test answer display
  - [ ] Test no double-reveal issues

- [ ] **PictureBoard Component**
  - [ ] Test board selection
  - [ ] Test picture navigation
  - [ ] Test team selection flow
  - [ ] Test completion handling

- [ ] **WorldRankings Component**
  - [ ] Test ranking display
  - [ ] Test answer reveal with correct ordering
  - [ ] Test animation and layout

- [ ] **F1GrandPrix Component**
  - [ ] Test car position updates
  - [ ] Test winner detection
  - [ ] Test score display

#### State Management Tests
- [ ] **Quiz Store**
  - [ ] Test game state transitions
  - [ ] Test timer state management
  - [ ] Test score updates
  - [ ] Test question navigation

- [ ] **Quiz Sync**
  - [ ] Test action broadcasting
  - [ ] Test state synchronization
  - [ ] Test connection handling

### 🔧 Medium Priority Tests

#### Hook Tests
- [ ] **useQuestions Hook**
  - [ ] Test question data loading
  - [ ] Test current question selection
  - [ ] Test round-specific logic (Picture Board)

- [ ] **useQuizSync Hook**
  - [ ] Test sync connection
  - [ ] Test action broadcasting
  - [ ] Test error handling

#### Utility Tests
- [ ] **Question Type Utilities**
  - [ ] Test normalizeOption function
  - [ ] Test question type detection
  - [ ] Test answer formatting

- [ ] **Round Utilities**
  - [ ] Test round ID generation
  - [ ] Test round configuration

### 🎨 UI/UX Tests

#### Component Rendering
- [ ] **Main Display**
  - [ ] Test responsive design
  - [ ] Test accessibility
  - [ ] Test loading states

- [ ] **Scoreboard Component**
  - [ ] Test score display
  - [ ] Test team colors
  - [ ] Test compact vs full mode

#### Integration Tests
- [ ] **End-to-End Game Flow**
  - [ ] Test complete game from start to finish
  - [ ] Test round transitions
  - [ ] Test final scoring

### 🐛 Edge Case Tests
- [ ] **Error Handling**
  - [ ] Test missing question data
  - [ ] Test network disconnection
  - [ ] Test invalid state transitions

- [ ] **Performance**
  - [ ] Test large question sets
  - [ ] Test memory usage
  - [ ] Test render performance

## 🛠️ Writing New Tests

### Test File Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and reset state
    vi.clearAllMocks();
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
    expect(true).toBe(true);
  });
});
```

### Mocking Patterns

```typescript
// Mock hooks
const mockUseQuizStore = vi.fn();
vi.mock('@/store/quizStore', () => ({
  useQuizStore: mockUseQuizStore
}));

// Mock external dependencies
vi.mock('@/hooks/useQuizSync', () => ({
  useQuizSync: () => ({ broadcastAction: vi.fn() })
}));
```

### Component Testing Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

it('should handle button click', () => {
  const mockOnClick = vi.fn();
  
  render(<MyComponent onClick={mockOnClick} />);
  
  fireEvent.click(screen.getByRole('button', { name: /click me/i }));
  
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
```

## 📊 Test Coverage Goals

### Current Coverage
- **Architecture**: Sync patterns documented
- **Regression**: Co-host options ordering
- **Setup**: Basic test infrastructure

### Target Coverage
- **Unit Tests**: 80%+ for core logic
- **Integration Tests**: Key user flows
- **E2E Tests**: Critical paths
- **Accessibility**: ARIA compliance

## 🚦 Test Status Indicators

- ✅ **Implemented**: Test exists and passes
- 🔄 **In Progress**: Being worked on
- 📋 **Planned**: Todo item
- ❌ **Blocked**: Dependencies not met
- 🔥 **High Priority**: Important for stability
- 🔧 **Medium Priority**: Important for quality
- 🎨 **Low Priority**: Nice to have

## 📝 Best Practices

1. **Test Names**: Be descriptive - "should do X when Y"
2. **Arrange/Act/Assert**: Structure tests clearly
3. **Mocking**: Mock external dependencies, not internal logic
4. **Coverage**: Focus on behavior, not implementation
5. **Maintenance**: Keep tests simple and readable
6. **Documentation**: Include manual testing checklists

## 🔍 Debugging Tests

```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific test with debug
npm test -- --no-coverage src/__tests__/my-test.test.ts

# Update snapshots
npm test -- --update-snapshots
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest vs Jest Comparison](https://vitest.dev/guide/comparison.html)

---

**Last Updated**: February 2026  
**Maintainer**: QLAF Development Team
