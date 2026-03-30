/**
 * Picture Board Reset Code Presence Test
 * 
 * Test that the reset code is present in the teamTimeUp function.
 * This is a code presence test that verifies the fix exists rather than testing functionality.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Picture Board Reset - Code Presence Test', () => {
  it('should verify the teamTimeUp function includes reset logic', () => {
    // Read the store file and verify our fix is present
    const storePath = join(__dirname, '../store/quizStore.ts');
    const storeContent = readFileSync(storePath, 'utf8');
    
    // Find the teamTimeUp implementation by looking for the function and its closing brace
    const teamTimeUpStart = storeContent.indexOf('teamTimeUp: () => {');
    const teamTimeUpEnd = storeContent.indexOf('},', teamTimeUpStart);
    const teamTimeUpCode = storeContent.substring(teamTimeUpStart, teamTimeUpEnd);
    
    // Check for the specific reset lines we added
    expect(teamTimeUpCode).toContain('currentPictureIndex: 0');
    expect(teamTimeUpCode).toContain('showAllPictures: false');
    expect(teamTimeUpCode).toContain('showAnswer: false');
    
    // Verify the reset is in the correct context (when nextTeam <= 3)
    expect(teamTimeUpCode).toMatch(/if\s*\(\s*nextTeam\s*<=\s*3\s*\)[\s\S]*currentPictureIndex:\s*0/s);
  });

  it('should verify the reset logic is in the right location', () => {
    // Read the store file
    const storePath = join(__dirname, '../store/quizStore.ts');
    const storeContent = readFileSync(storePath, 'utf8');
    
    // Find the teamTimeUp function
    const teamTimeUpStart = storeContent.indexOf('teamTimeUp: () => {');
    const teamTimeUpEnd = storeContent.indexOf('},', teamTimeUpStart);
    const teamTimeUpCode = storeContent.substring(teamTimeUpStart, teamTimeUpEnd);
    
    // Verify the structure: reset should happen when advancing to next team
    const lines = teamTimeUpCode.split('\n');
    const resetLineIndex = lines.findIndex(line => line.includes('currentPictureIndex: 0'));
    
    // The reset should be inside the "if (nextTeam <= 3)" block
    const ifBlockStart = lines.findIndex(line => line.includes('if (nextTeam <= 3)'));
    
    expect(resetLineIndex).toBeGreaterThan(ifBlockStart);
    expect(resetLineIndex).toBeLessThan(lines.length - 1);
  });
});
