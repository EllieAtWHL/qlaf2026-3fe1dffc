import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { Car } from 'lucide-react';

export const F1GrandPrix = () => {
  const { teams, f1Positions } = useQuizStore();

  const teamColors = [
    { bg: 'bg-red-500', text: 'text-red-500', glow: 'shadow-red-500/50' },
    { bg: 'bg-green-500', text: 'text-green-500', glow: 'shadow-green-500/50' },
    { bg: 'bg-yellow-500', text: 'text-yellow-500', glow: 'shadow-yellow-500/50' },
  ];

  // Determine if anyone has won
  const winner = f1Positions.findIndex(pos => pos >= 100);

  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-6xl font-black text-foreground text-glow-primary">
          F1 GRAND PRIX FINAL
        </h1>
        <p className="font-body text-lg text-muted-foreground mt-2">
          First to the finish line wins!
        </p>
      </motion.div>

      {/* Race track */}
      <div className="flex-1 flex flex-col justify-center gap-6 max-w-6xl mx-auto w-full">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            {/* Team name and score */}
            <div className="flex justify-between items-center mb-2">
              <span className={`font-display text-xl font-bold ${teamColors[index].text}`}>
                {team.name}
              </span>
              <span className="font-display text-lg text-muted-foreground">
                {Math.round(f1Positions[index])}%
              </span>
            </div>

            {/* Track */}
            <div className="f1-track relative h-20 rounded-lg overflow-hidden">
              {/* Track markings */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-dashed border-white/10"
                  />
                ))}
              </div>

              {/* Finish line */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-white to-white/50">
                <div className="w-full h-full bg-checkerboard opacity-80" />
              </div>

              {/* Car */}
              <motion.div
                className="f1-car absolute top-1/2 -translate-y-1/2 z-10"
                style={{ left: `${Math.min(f1Positions[index], 95)}%` }}
                initial={{ left: 0 }}
                animate={{ left: `${Math.min(f1Positions[index], 95)}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              >
                <div className={`relative ${teamColors[index].bg} rounded-lg p-2 shadow-lg ${teamColors[index].glow}`}>
                  <Car className="w-10 h-10 text-white" strokeWidth={1.5} />
                  {/* Speed lines */}
                  {f1Positions[index] > 0 && f1Positions[index] < 100 && (
                    <motion.div
                      className="absolute right-full top-1/2 -translate-y-1/2 flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                    >
                      <div className={`w-4 h-0.5 ${teamColors[index].bg} opacity-60`} />
                      <div className={`w-6 h-0.5 ${teamColors[index].bg} opacity-40`} />
                      <div className={`w-8 h-0.5 ${teamColors[index].bg} opacity-20`} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Winner celebration */}
              {winner === index && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50"
                >
                  <span className="font-display text-4xl font-black text-qlaf-gold text-glow-gold">
                    🏆 WINNER! 🏆
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex gap-8 glass-card rounded-xl px-8 py-4">
          {teams.map((team, index) => (
            <div key={team.id} className="text-center">
              <div className={`font-display text-lg ${teamColors[index].text}`}>
                {team.name}
              </div>
              <div className="font-display text-3xl font-bold text-foreground">
                {team.totalScore}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* QLAF branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="font-display text-sm text-muted-foreground/50 tracking-[0.5em]">
          QLAF 2026
        </span>
      </div>
    </div>
  );
};
