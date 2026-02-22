# QLAF 2026 Test Suite

This directory contains tests for the QLAF 2026 quiz application to ensure functionality works correctly and to prevent regressions when adding new features.

## Test Structure

```
tests/
├── unit/           # Unit tests for individual functions and logic
├── integration/    # Integration tests for component interactions
└── docs/          # Test documentation and guidelines
```

## Running Tests

### Unit Tests
```bash
# Run individual unit tests
node tests/unit/picture-board-filtering.test.js

# Run all unit tests (when we have more)
node tests/unit/*.test.js
```

### Integration Tests
```bash
# Integration tests will be added here as we expand testing
# These will test component interactions and full workflows
```

## Test Categories

### Picture Board Tests
- **picture-board-filtering.test.js**: Tests board selection filtering logic
  - Verifies chosen boards are removed from selection UI
  - Tests all stages of team selection process
  - Regression test for feature branch `feature/remove-chosen-picture-board-options`

### Future Test Categories
- Round transition tests
- Timer synchronization tests
- Score calculation tests
- Co-host interface tests
- Main display rendering tests

## Writing New Tests

### Unit Test Guidelines
1. Test single functions or pieces of logic
2. Use descriptive test names and descriptions
3. Include the feature branch and date in comments
4. Test edge cases and error conditions
5. Use the existing test structure and format

### Integration Test Guidelines
1. Test component interactions
2. Test full user workflows
3. Include setup and teardown procedures
4. Test both happy path and error scenarios

## Test Documentation

Each test should include:
- Clear description of what's being tested
- Reference to the feature/branch that introduced it
- Date when the test was created
- Expected vs actual behavior documentation

## Regression Testing

When adding new features:
1. Run existing tests to ensure no regressions
2. Add new tests for the new functionality
3. Update this README with new test categories
4. Document any breaking changes

## Continuous Integration

These tests can be integrated into CI/CD pipelines to automatically catch regressions before deployment.

## Test Data

Tests use mock data that mirrors the structure of real data but doesn't depend on external files or services.
