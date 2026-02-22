# Test Checklist

## Before Adding New Features

- [ ] Run existing unit tests
- [ ] Run existing integration tests (when available)
- [ ] Test manually in browser
- [ ] Check for console errors
- [ ] Verify responsive design works
- [ ] Test co-host sync functionality

## When Adding New Features

- [ ] Write unit tests for new logic
- [ ] Write integration tests for new workflows
- [ ] Update test documentation
- [ ] Add regression tests for critical paths
- [ ] Test edge cases and error conditions

## Picture Board Specific Tests

- [ ] Board filtering works correctly
- [ ] Teams cannot select already chosen boards
- [ ] Board selection updates UI properly
- [ ] Timer functionality works with board selection
- [ ] Score updates work correctly
- [ ] Round transition works without errors

## Round Transition Tests

- [ ] No crashes during transitions (regression for Only Connect issue)
- [ ] State clears properly between rounds
- [ ] Timer resets correctly
- [ ] Score persistence works
- [ ] Co-host sync maintains connection

## Co-Host Interface Tests

- [ ] All controls are responsive
- [ ] Touch targets are 44px minimum
- [ ] Actions broadcast correctly
- [ ] State sync works bidirectionally
- [ ] No double-action issues

## Main Display Tests

- [ ] 16:9 aspect ratio maintained
- [ ] No scrolling required on TV displays
- [ ] All round types render correctly
- [ ] Loading states work properly
- [ ] Error boundaries catch issues gracefully

## Performance Tests

- [ ] Image preloading works
- [ ] No memory leaks during round transitions
- [ ] Smooth animations and transitions
- [ ] Fast initial load times
