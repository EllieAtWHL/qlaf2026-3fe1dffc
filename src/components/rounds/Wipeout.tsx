import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
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
        transition={{ duration: 0.6, ease: "easeInOut" }}
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
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ 
                    opacity: 1,
                    scale: isRevealed ? [1, 0.8, 1] : 1,
                    rotateY: isRevealed ? [0, 90, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeInOut"
                  }}
                  className={`
                    aspect-video glass-card rounded-lg p-2 md:p-3 flex flex-col 
                    items-center justify-center relative max-h-[28vh] md:max-h-[30vh] 
                    transition-colors duration-300 ${
                    isRevealed
                      ? isCorrect
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-red-500/20 border-red-500/50'
                      : 'bg-primary text-primary-foreground'
                  }`}
                  data-testid={`answer-box-${index}`}
                  style={{
                    borderColor: isRevealed ? (isCorrect ? 'rgb(34 197 94 / 0.5)' : 'rgb(239 68 68 / 0.5)') : 'transparent',
                    transitionDelay: isRevealed ? '0.6s' : '0s'
                  }}
                >
                  {/* Content */}
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-3">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ 
                        opacity: isRevealed ? [1, 0, 0, 1] : 1
                      }}
                      transition={{ 
                        duration: 0.8, 
                        ease: "easeInOut",
                        times: isRevealed ? [0, 0.3, 0.7, 1] : undefined
                      }}
                      className="w-full h-full flex flex-col items-center justify-center"
                    >
                      {isRevealed ? (
                        <>
                          {/* Only show correct/incorrect status when revealed */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: isRevealed ? 1 : 0
                            }}
                            transition={{ 
                              duration: 0.2, 
                              delay: isRevealed ? 0.6 : 0
                            }}
                            className="flex items-center gap-1"
                          >
                            {isCorrect ? (
                              <Check className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                            ) : (
                              <X className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                            )}
                            <span className={`text-lg md:text-xl font-bold ${
                              isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isCorrect ? 'CORRECT' : 'WIPEOUT'}
                            </span>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          {/* Answer option text on card front before reveal */}
                          <div className="text-md md:text-base font-medium text-center text-primary-foreground">
                            {option.text}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
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
