import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';
import { X, Grid3X3 } from 'lucide-react';

export const DavesDozen = () => {
  const {
    currentRoundIndex,
    showAnswer,
    gameState,
    isTransitioning,
    davesDozenRevealedAnswers,
    davesDozenShowRedCross
  } = useQuizStore();

  const { currentQuestion } = useQuestions();
  const round = ROUNDS[currentRoundIndex];

  // If we're transitioning or not in round state, don't render anything
  if (isTransitioning || gameState !== 'round') {
    return null;
  }

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Grid3X3 className="w-10 h-10 text-primary" />
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
          {round.timerDuration && <Timer compact />}
          <Scoreboard compact />
        </div>
      </motion.div>

      {/* Question content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-body text-2xl md:text-4xl text-foreground leading-relaxed">
          {currentQuestion?.content}
        </p>
      </motion.div>

      {/* 12 boxes grid */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {currentQuestion?.answers?.map((answer: any) => {
              const isRevealed = davesDozenRevealedAnswers.has(answer.number);
              
              return (
                <motion.div
                  key={answer.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: answer.number * 0.05 }}
                  className="aspect-square glass-card rounded-xl p-4 flex flex-col items-center justify-center relative"
                >
                  {/* Number badge */}
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="font-display text-sm font-bold text-primary-foreground">
                      {answer.number}
                    </span>
                  </div>

                  {/* Content */}
                  {isRevealed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {/* Reveal image */}
                      <div className="w-full h-3/4 mb-2 rounded-lg overflow-hidden bg-secondary/50">
                        <img 
                          src={answer.imageUrl} 
                          alt={answer.text}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      {/* Answer text */}
                      <div className="text-center">
                        <p className="font-display text-sm font-semibold text-foreground">
                          {answer.text}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                        <span className="font-display text-2xl font-bold text-muted-foreground">
                          {answer.number}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Red Cross overlay for incorrect answers */}
      {davesDozenShowRedCross && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div className="relative">
            <X className="w-64 h-64 text-red-500 stroke-[8]" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      )}

      {/* QLAF branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="font-display text-sm text-muted-foreground/50 tracking-[0.5em]">
          QLAF 2026
        </span>
      </div>
    </div>
  );
};
