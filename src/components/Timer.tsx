import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { Howl } from 'howler';

// Sound effects using local files
const tickSound = new Howl({
  src: ['/sounds/tick.wav'],
  volume: 0.3,
  onload: () => console.log('[Timer Sound] Tick sound loaded successfully'),
  onloaderror: (id, error) => console.error('[Timer Sound] Failed to load tick sound:', error),
});

const warningSound = new Howl({
  src: ['/sounds/warning.wav'],
  volume: 0.5,
  onload: () => console.log('[Timer Sound] Warning sound loaded successfully'),
  onloaderror: (id, error) => console.error('[Timer Sound] Failed to load warning sound:', error),
});

const timeUpSound = new Howl({
  src: ['/sounds/finish.mp3'],
  volume: 0.7,
  onload: () => console.log('[Timer Sound] Time-up sound loaded successfully'),
  onloaderror: (id, error) => console.error('[Timer Sound] Failed to load time-up sound:', error),
});

interface TimerProps {
  compact?: boolean;
}

export const Timer = ({ compact = false }: TimerProps) => {
  const { timerValue, isTimerRunning, tick } = useQuizStore();
  const lastTickRef = useRef<number>(timerValue);
  const hasPlayedTimeUp = useRef(false);

  // Timer interval for local countdown on main display
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && timerValue > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timerValue, tick]);

  // Sound effects
  useEffect(() => {
    if (isTimerRunning && timerValue !== lastTickRef.current) {
      console.log(`[Timer Sound] Value: ${timerValue}, Running: ${isTimerRunning}, Last: ${lastTickRef.current}`);
      
      // Play warning sound at exactly 10 seconds
      if (timerValue === 10) {
        console.log('[Timer Sound] Playing warning sound at 10s');
        warningSound.play();
      }
      // Play tick sound for 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1 seconds
      else if (timerValue <= 59 && timerValue > 0 && timerValue !== 10) {
        console.log(`[Timer Sound] Playing tick sound at ${timerValue}s`);
        tickSound.play();
      }
      // Play time-up sound when timer reaches 0 (only once)
      else if (timerValue === 0 && !hasPlayedTimeUp.current) {
        console.log('[Timer Sound] Playing time-up sound at 0s');
        timeUpSound.play();
        hasPlayedTimeUp.current = true;
      }
      lastTickRef.current = timerValue;
    }
    
    // Reset time-up flag when timer resets above 0
    if (timerValue > 10) {
      hasPlayedTimeUp.current = false;
    }
  }, [timerValue, isTimerRunning]);

  const minutes = Math.floor(timerValue / 60);
  const seconds = timerValue % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const getTimerColor = () => {
    if (timerValue <= 10) return 'text-qlaf-danger';
    if (timerValue <= 30) return 'text-qlaf-warning';
    return 'text-qlaf-success';
  };

  const getTimerClass = () => {
    if (timerValue <= 10 && isTimerRunning) return 'timer-danger';
    if (timerValue <= 30 && isTimerRunning) return 'timer-warning';
    return '';
  };

  const progressPercent = (timerValue / 60) * 100;

  if (compact) {
    return (
      <div className={`timer-display text-3xl ${getTimerColor()} ${getTimerClass()}`}>
        {formattedTime}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-6 text-center"
    >
      {/* Circular progress */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={timerValue <= 10 ? 'hsl(var(--qlaf-danger))' : timerValue <= 30 ? 'hsl(var(--qlaf-warning))' : 'hsl(var(--qlaf-success))'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={timerValue}
            initial={{ scale: timerValue <= 10 ? 1.2 : 1 }}
            animate={{ scale: 1 }}
            className={`timer-display text-5xl font-black ${getTimerColor()} ${getTimerClass()}`}
          >
            {formattedTime}
          </motion.span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-center gap-2">
        <motion.div
          className={`w-3 h-3 rounded-full ${isTimerRunning ? 'bg-qlaf-success' : 'bg-qlaf-warning'}`}
          animate={isTimerRunning ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="font-body text-muted-foreground uppercase tracking-wider text-sm">
          {isTimerRunning ? 'Running' : timerValue === 0 ? 'Finished' : 'Paused'}
        </span>
      </div>
    </motion.div>
  );
};
