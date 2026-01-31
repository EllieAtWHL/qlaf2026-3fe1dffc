import { motion } from 'framer-motion';
import { Timer } from '@/components/Timer';
import { Scoreboard } from '@/components/Scoreboard';
import { useQuizStore, ROUNDS } from '@/store/quizStore';

interface GenericRoundProps {
  roundId: string;
}

export const GenericRound = ({ roundId }: GenericRoundProps) => {
  const { currentRoundIndex } = useQuizStore();
  const round = ROUNDS[currentRoundIndex];

  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header with round info and timer */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
      >
        {/* Round info */}
        <div>
          <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
            Round {currentRoundIndex + 1}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground text-glow-primary">
            {round.name}
          </h1>
        </div>

        {/* Compact scoreboard */}
        <Scoreboard compact />
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl w-full text-center"
        >
          {/* Question/Content placeholder */}
          <div className="mb-8">
            <p className="font-body text-2xl md:text-3xl text-foreground">
              {round.description}
            </p>
            <p className="font-body text-lg text-muted-foreground mt-4">
              Questions will be displayed here during the quiz
            </p>
          </div>

          {/* Timer for timed rounds */}
          {round.timerDuration && (
            <div className="flex justify-center">
              <Timer />
            </div>
          )}
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
