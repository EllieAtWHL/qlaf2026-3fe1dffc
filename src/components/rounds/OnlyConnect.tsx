import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useEffect, useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { Link, Eye, EyeOff } from 'lucide-react';

interface OnlyConnectOption {
  text?: string;
  imageUrl?: string;
}

interface OnlyConnectQuestion {
  id: string;
  type: 'connection';
  content: string;
  options: OnlyConnectOption[];
  answer: string;
}

export const OnlyConnect = () => {
  const {
    currentRoundIndex,
    showAnswer,
    onlyConnectRevealedOptions,
    revealOnlyConnectOption,
  } = useQuizStore();

  const { currentQuestion } = useQuestions();

  const round = ROUNDS[currentRoundIndex];
  const question = currentQuestion as OnlyConnectQuestion | undefined;

  // Calculate points based on revealed options
  const points = [5, 3, 2, 1][onlyConnectRevealedOptions - 1] || 1;

  if (!question || !question.options) {
    return (
      <div className="min-h-screen qlaf-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Only Connect</h1>
          <p className="text-xl text-white/90">No question available</p>
        </div>
      </div>
    );
  }

  const optionVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const renderOption = (option: OnlyConnectOption, index: number) => {
    const isRevealed = index < onlyConnectRevealedOptions;

    // Don't render unrevealed options at all
    if (!isRevealed) return null;

    return (
      <motion.div
        key={index}
        variants={optionVariants}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-xl p-6 overflow-hidden flex items-center justify-center"
        style={{
          width: '366px',
          height: '327px'
        }}
      >
        {option.imageUrl ? (
          <div className="bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <img 
              src={option.imageUrl} 
              alt={`Option ${index + 1}`}
              className="object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
              onError={(e) => {
                console.log(`[OnlyConnect] Failed to load image: ${option.imageUrl}`, e);
                e.currentTarget.src = '/placeholder.svg';
              }}
              onLoad={() => {
                console.log(`*** [OnlyConnect] Successfully loaded image: ${option.imageUrl}`);
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <p className="font-display text-2xl md:text-3xl text-foreground text-center leading-relaxed">
              {option.text}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Link className="w-10 h-10 text-primary" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Only Connect
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow-primary">
              Find the Connection
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Points Display */}
          <div className="text-center">
            <div className="font-display text-sm text-muted-foreground uppercase tracking-wider">
              Points Available
            </div>
            <div className="font-display text-2xl font-bold text-qlaf-gold">
              {points}
            </div>
          </div>

          <Scoreboard compact />
        </div>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
          {question.content}
        </h2>
      </motion.div>

      {/* Options and Answer Side by Side */}
      <motion.div 
        className="flex justify-center items-center gap-8 flex-1 px-4 min-h-[40vh]"
        layout
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* Images on the left */}
        <motion.div 
          className="flex justify-center"
          layout
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } }
          }}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-2 gap-6 auto-rows-max w-fit">
            {question.options?.map((option, index) => renderOption(option, index))}
          </div>
        </motion.div>

        {/* Answer on the right */}
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center"
            layout
          >
            <div className="glass-card rounded-xl p-6 max-w-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Eye className="w-6 h-6 text-qlaf-success" />
                <h3 className="font-display text-xl font-bold text-qlaf-success">
                  Connection
                </h3>
              </div>
              <p className="font-display text-xl text-foreground">
                {question.answer}
              </p>
            </div>
          </motion.div>
        )}
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
