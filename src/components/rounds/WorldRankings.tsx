import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { Scoreboard } from '@/components/Scoreboard';
import { Globe } from 'lucide-react';

// Sample data structure for ranking questions
interface RankingItem {
  id: string;
  label: string;
  subLabel?: string;
  imageUrl?: string;
}

export const WorldRankings = () => {
  const { currentRoundIndex, showAnswer } = useQuizStore();
  const round = ROUNDS[currentRoundIndex];

  // Example items (would come from question bank)
  const exampleItems: RankingItem[] = [
    { id: '1', label: 'Item A', subLabel: 'Description A' },
    { id: '2', label: 'Item B', subLabel: 'Description B' },
    { id: '3', label: 'Item C', subLabel: 'Description C' },
    { id: '4', label: 'Item D', subLabel: 'Description D' },
  ];

  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <Globe className="w-10 h-10 text-primary" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Round {currentRoundIndex + 1}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground text-glow-primary">
              {round.name}
            </h1>
          </div>
        </div>

        <Scoreboard compact />
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          {/* Question title */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              Rank these items from highest to lowest
            </h2>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exampleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card rounded-xl p-6 text-center ${showAnswer ? 'border-2 border-qlaf-gold' : ''}`}
              >
                {showAnswer && (
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-qlaf-gold flex items-center justify-center font-display font-bold text-black">
                    {index + 1}
                  </div>
                )}
                <p className="font-display text-xl font-bold text-foreground">
                  {item.label}
                </p>
                {item.subLabel && (
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    {item.subLabel}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
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
