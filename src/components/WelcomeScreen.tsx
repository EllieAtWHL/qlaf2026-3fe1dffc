import { motion } from 'framer-motion';
import { Trophy, Users, Timer, Star } from 'lucide-react';

interface WelcomeScreenProps {
  isCoHost?: boolean;
  onStart?: () => void;
}

export const WelcomeScreen = ({ isCoHost = false, onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen qlaf-bg flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 border border-primary/20 rounded-full compass-decoration" />
        <div className="absolute bottom-20 left-10 w-96 h-96 border border-accent/10 rounded-full compass-decoration" style={{ animationDirection: 'reverse' }} />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 border border-primary/10 rounded-full compass-decoration" style={{ animationDuration: '45s' }} />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Logo grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8 max-w-[280px] mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {[Trophy, Users, Timer, Star].map((Icon, index) => (
            <motion.div
              key={index}
              className="w-32 h-32 glass-card rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </motion.div>
          ))}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-foreground text-glow-primary tracking-wider">
            A QUESTION OF
          </h1>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary text-glow-primary tracking-widest">
            A LEAGUE LIKE A FAN
          </h2>
        </motion.div>

        {/* Year */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          className="mt-8"
        >
          <span className="font-display text-6xl md:text-8xl lg:text-9xl font-black text-accent text-glow-cyan tracking-widest">
            2026
          </span>
        </motion.div>

        {/* Co-host start button */}
        {isCoHost && onStart && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onStart}
            className="mt-12 btn-qlaf px-12 py-4 rounded-xl text-xl text-primary-foreground"
          >
            Start Quiz
          </motion.button>
        )}

        {/* Subtitle for main screen */}
        {!isCoHost && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 font-body text-xl md:text-2xl text-muted-foreground tracking-wide"
          >
            The Ultimate Sports Quiz Experience
          </motion.p>
        )}
      </motion.div>

      {/* Pulsing glow at bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, hsla(280, 100%, 65%, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
