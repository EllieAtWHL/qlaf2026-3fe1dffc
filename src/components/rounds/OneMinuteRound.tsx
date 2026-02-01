import { motion } from 'framer-motion';
import { Timer } from '@/components/Timer';
import { Scoreboard } from '@/components/Scoreboard';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { Clock } from 'lucide-react';

export const OneMinuteRound = () => {
  const { currentRoundIndex, timerValue, isTimerRunning } = useQuizStore();
  const round = ROUNDS[currentRoundIndex];

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Pulsing background for high energy */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isTimerRunning 
            ? `radial-gradient(circle at center, hsla(${timerValue <= 10 ? '0' : timerValue <= 30 ? '45' : '140'}, 100%, 50%, 0.1) 0%, transparent 70%)`
            : 'transparent',
        }}
        animate={isTimerRunning ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 relative z-10"
      >
        <div className="flex items-center gap-4">
          <Clock className="w-10 h-10 text-qlaf-warning" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Round {currentRoundIndex + 1}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-qlaf-warning text-glow-gold">
              {round.name}
            </h1>
          </div>
        </div>

        <Scoreboard compact />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Big timer */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <Timer />
        </motion.div>

        {/* Quick fire indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl px-8 py-4"
        >
          <p className="font-display text-xl text-foreground uppercase tracking-wider">
            ⚡ QUICK FIRE QUESTIONS ⚡
          </p>
        </motion.div>
      </div>

      {/* QLAF branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="font-display text-sm text-muted-foreground/50 tracking-[0.5em]">
          QLAF 2026
        </span>
      </div>
    </div>
  );
};
