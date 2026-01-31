import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { 
  Globe, Users, Image, Link, RotateCcw, 
  Gavel, Tv, Calculator, Skull, Clock, Flag 
} from 'lucide-react';

const roundIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'world-rankings': Globe,
  'just-one': Users,
  'picture-board': Image,
  'only-connect': Link,
  'round-robin': RotateCcw,
  'daves-dozen': Gavel,
  'ellies-tellies': Tv,
  'distinctly-average': Calculator,
  'wipeout': Skull,
  'one-minute-round': Clock,
  'f1-grand-prix': Flag,
};

interface RoundTransitionProps {
  isCoHost?: boolean;
  onStartRound?: () => void;
}

export const RoundTransition = ({ isCoHost = false, onStartRound }: RoundTransitionProps) => {
  const { currentRoundIndex } = useQuizStore();
  const round = ROUNDS[currentRoundIndex];
  const Icon = roundIcons[round.id] || Globe;

  return (
    <div className="min-h-screen qlaf-bg flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(280, 100%, 65%, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(195, 100%, 50%, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        {/* Round number */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <span className="font-display text-xl md:text-2xl text-muted-foreground uppercase tracking-[0.3em]">
            Round {currentRoundIndex + 1}
          </span>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto glass-card rounded-2xl flex items-center justify-center animate-glow-pulse">
            <Icon className="w-16 h-16 md:w-20 md:h-20 text-primary" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Round name */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="round-title text-4xl md:text-6xl lg:text-7xl text-foreground text-glow-primary mb-4"
        >
          {round.name}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto"
        >
          {round.description}
        </motion.p>

        {/* Timer indicator if timed round */}
        {round.timerDuration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5 text-qlaf-warning" />
            <span className="font-display text-lg text-qlaf-warning">
              {Math.floor(round.timerDuration / 60)}:{(round.timerDuration % 60).toString().padStart(2, '0')} Timed Round
            </span>
          </motion.div>
        )}

        {/* Team/Individual indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4"
        >
          <span className={`inline-block px-4 py-1 rounded-full font-body text-sm uppercase tracking-wider
            ${round.isTeamRound ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}
          >
            {round.isTeamRound ? 'Team Round' : 'Individual Round'}
          </span>
        </motion.div>

        {/* Co-host start button */}
        {isCoHost && onStartRound && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={onStartRound}
            className="mt-10 btn-qlaf px-10 py-4 rounded-xl text-lg text-primary-foreground"
          >
            Start Round
          </motion.button>
        )}
      </motion.div>

      {/* QLAF branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="font-display text-sm text-muted-foreground/50 tracking-[0.5em]">
          QLAF 2026
        </span>
      </motion.div>
    </div>
  );
};
