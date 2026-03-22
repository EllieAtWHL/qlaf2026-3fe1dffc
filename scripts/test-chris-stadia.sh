#!/bin/bash

# Chris Stadia Automated Test Runner
# This script runs all automated tests for the Chris Stadia two-stage watch card reveal system

echo "🏆 Running Chris Stadia Automated Test Suite"
echo "=========================================="

# Test files to run
TEST_FILES=(
  "src/store/__tests__/chris-stadia-store.automated.test.ts"
  "src/hooks/__tests__/chris-stadia-sync.automated.test.ts"
  "src/components/rounds/__tests__/chris-stadia-logic.automated.test.ts"
)

# Run each test file and collect results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

for test_file in "${TEST_FILES[@]}"; do
  echo ""
  echo "📋 Running: $test_file"
  echo "--------------------------------"
  
  # Run the test and capture output
  if npm test -- --run --reporter=basic "$test_file" > /dev/null 2>&1; then
    echo "✅ PASSED: $test_file"
    ((PASSED_TESTS++))
  else
    echo "❌ FAILED: $test_file"
    ((FAILED_TESTS++))
  fi
  ((TOTAL_TESTS++))
done

echo ""
echo "=========================================="
echo "🏆 Test Results Summary"
echo "=========================================="
echo "Total Test Files: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
  echo ""
  echo "🎉 All Chris Stadia tests passed! The two-stage watch card reveal system is working correctly."
  exit 0
else
  echo ""
  echo "⚠️  Some tests failed. Please check the implementation."
  exit 1
fi
