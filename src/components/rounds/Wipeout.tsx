import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';
import { Check, X, Skull } from 'lucide-react';
import { WipeoutOption } from '@/types/questions';

export const Wipeout = () => {
  const {
    currentRoundIndex,
    showAnswer,
    gameState,
    isTransitioning,
    wipeoutRevealedAnswers
  } = useQuizStore();

  const { currentQuestion } = useQuestions();
  const round = ROUNDS[currentRoundIndex];

  // If we're transitioning or not in round state, don't render anything
  if (isTransitioning || gameState !== 'round') {
    return null;
  }

  // Defensive check for question and options
  if (!currentQuestion || !currentQuestion.options) {
    return (
      <div className="main-display-round qlaf-bg flex flex-col items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="font-body text-xl text-muted-foreground">Loading Wipeout round...</p>
        </div>
      </div>
    );
  }

  // Determine which answers are correct
  const options = currentQuestion.options as Array<WipeoutOption>;
  const correctAnswers = options?.filter(option => option.correct) || [];

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Skull className="w-10 h-10 text-primary" />
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
          {currentQuestion.content}
        </p>
      </motion.div>

      {/* 12 boxes grid */}
      <div className="flex-1 flex items-center justify-center px-2 md:px-4 max-h-[75vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full max-w-6xl"
        >
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 h-full" data-testid="wipeout-grid">
            {options.map((option: WipeoutOption, index: number) => {
              const isRevealed = wipeoutRevealedAnswers?.has(index) || false;
              const isCorrect = option.correct;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`aspect-video glass-card rounded-lg p-2 md:p-3 flex flex-col items-center justify-center relative max-h-[28vh] md:max-h-[30vh] ${
                    isRevealed 
                      ? isCorrect 
                        ? 'bg-green-500/20 border-green-500/50' 
                        : 'bg-red-500/20 border-red-500/50'
                      : ''
                  }`}
                  data-testid={`answer-box-${index}`}
                >
                  {/* Number badge */}
                  <div className={`absolute top-1 right-1 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center z-10 ${
                    isRevealed
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <span className="font-display text-xs md:text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  {isRevealed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      {/* Answer text */}
                      <span className={`font-body text-sm md:text-base text-center font-medium ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {option.text}
                      </span>
                      
                      {/* Correct/Incorrect indicator */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {isCorrect ? (
                          <>
                            <Check className="w-3 h-3" />
                            CORRECT
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            WIPEOUT
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-2xl md:text-3xl font-bold text-muted-foreground/50 tracking-[0.3em]">
                        WIPE
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
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
