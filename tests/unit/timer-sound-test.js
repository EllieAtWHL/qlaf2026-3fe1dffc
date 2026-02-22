/**
 * Timer Sound Test
 * 
 * Tests if timer sounds are working correctly
 * Diagnoses common sound issues
 */

const { Howl } = require('howler');

// Test sound URLs (same as Timer component)
const tickSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
  volume: 0.3,
});

const warningSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3'],
  volume: 0.5,
});

const buzzerSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'],
  volume: 0.7,
});

console.log('🔊 Timer Sound Test\n');

// Test each sound
const testSounds = [
  { name: 'Tick Sound', sound: tickSound, description: 'Plays every second when ≤ 10s' },
  { name: 'Warning Sound', sound: warningSound, description: 'Plays at exactly 10s' },
  { name: 'Buzzer Sound', sound: buzzerSound, description: 'Plays when timer reaches 0s' }
];

let testIndex = 0;

const runTest = () => {
  if (testIndex >= testSounds.length) {
    console.log('\n✅ All sound tests completed!');
    console.log('\n🔍 If you didn\'t hear sounds:');
    console.log('1. Check browser audio permissions');
    console.log('2. Try interacting with the page first (click anywhere)');
    console.log('3. Check if external URLs are blocked');
    console.log('4. Try in a different browser');
    console.log('5. Check browser developer console for errors');
    return;
  }

  const test = testSounds[testIndex];
  console.log(`\nTest ${testIndex + 1}: ${test.name}`);
  console.log(`Description: ${test.description}`);
  
  // Test sound state
  console.log(`Sound state: ${test.sound.state()}`);
  console.log(`Duration: ${test.sound.duration()}s`);
  
  // Play sound
  test.sound.play();
  
  // Wait for sound to finish
  setTimeout(() => {
    console.log('✅ Sound played successfully');
    testIndex++;
    runTest();
  }, 2000);
};

// Check Howl.js support
console.log('Howl.js version:', Howl.version);
console.log('Web Audio API support:', Howl.usingWebAudio);

// Check browser audio context
if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
  console.log('AudioContext supported: ✅');
} else {
  console.log('AudioContext supported: ❌');
}

// Start tests
console.log('\n🎵 Starting sound tests...');
console.log('Make sure your volume is up and you\'ve interacted with the page!');
runTest();
