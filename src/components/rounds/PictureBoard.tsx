import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { Timer } from '@/components/Timer';
import { Scoreboard } from '@/components/Scoreboard';
import { Image } from 'lucide-react';

export const PictureBoard = () => {
  const { currentRoundIndex, showAnswer } = useQuizStore();
  const round = ROUNDS[currentRoundIndex];

  // Placeholder images grid
  const pictureGrid = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    revealed: showAnswer || i < 6,
    answer: `Answer ${i + 1}`,
  }));

  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Image className="w-10 h-10 text-primary" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Round {currentRoundIndex + 1}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow-primary">
              {round.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Timer compact />
          <Scoreboard compact />
        </div>
      </motion.div>

      {/* Picture grid */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-5xl"
        >
          {pictureGrid.map((picture, index) => (
            <motion.div
              key={picture.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`aspect-square glass-card rounded-xl overflow-hidden relative group cursor-pointer
                ${picture.revealed ? 'border-2 border-qlaf-success' : ''}`}
            >
              {/* Number badge */}
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center font-display font-bold text-sm text-primary-foreground z-10">
                {picture.id}
              </div>

              {/* Placeholder content */}
              <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                <span className="font-body text-4xl text-muted-foreground">?</span>
              </div>

              {/* Hover/reveal overlay */}
              {picture.revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-qlaf-success/20 flex items-center justify-center"
                >
                  <span className="font-display text-lg text-foreground text-center px-2">
                    {picture.answer}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
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
