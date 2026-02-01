import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { Howl } from 'howler';

// Sound URLs (using free sound effects)
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

interface TimerProps {
  compact?: boolean;
}

export const Timer = ({ compact = false }: TimerProps) => {
  const { timerValue, isTimerRunning, tick } = useQuizStore();
  const lastTickRef = useRef<number>(timerValue);
  const hasPlayedBuzzer = useRef(false);

  // Only run timer logic in main app (host), not in co-host
  const isMainApp = typeof window !== 'undefined' && window.location.pathname === '/';

  useEffect(() => {
    if (!isTimerRunning || !isMainApp) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tick, isMainApp]);

  // Sound effects
  useEffect(() => {
    if (isTimerRunning && timerValue !== lastTickRef.current) {
      if (timerValue <= 10 && timerValue > 0) {
        tickSound.play();
      }
      if (timerValue === 10) {
        warningSound.play();
      }
      if (timerValue === 0 && !hasPlayedBuzzer.current) {
        buzzerSound.play();
        hasPlayedBuzzer.current = true;
      }
      lastTickRef.current = timerValue;
    }
    
    // Reset buzzer flag when timer resets
    if (timerValue > 10) {
      hasPlayedBuzzer.current = false;
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
