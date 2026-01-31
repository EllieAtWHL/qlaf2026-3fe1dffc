import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { Scoreboard } from '@/components/Scoreboard';
import { useQuestions } from '@/hooks/useQuestions';
import { normalizeOption } from '@/types/questions';
import { Globe } from 'lucide-react';

export const WorldRankings = () => {
  const { currentRoundIndex, showAnswer, currentQuestionIndex } = useQuizStore();
  const { currentQuestion, totalQuestions } = useQuestions();
  const round = ROUNDS[currentRoundIndex];

  // Get options from current question or use empty array
  const options = currentQuestion?.options?.map(normalizeOption) || [];

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
          key={currentQuestionIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl"
        >
          {currentQuestion ? (
            <>
              {/* Question number */}
              <div className="text-center mb-4">
                <span className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Question title */}
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-foreground">
                  {currentQuestion.content}
                </h2>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card rounded-xl p-6 text-center relative ${showAnswer ? 'border-2 border-qlaf-gold' : ''}`}
                  >
                    {showAnswer && (
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-qlaf-gold flex items-center justify-center font-display font-bold text-black z-10">
                        {(currentQuestion.answer as string[]).indexOf(item.label) + 1}
                      </div>
                    )}
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.label}
                        className="w-full h-20 object-contain mb-4"
                      />
                    )}
                    <p className="font-display text-xl font-bold text-foreground">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Answer reveal */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-qlaf-success/20 border-2 border-qlaf-success rounded-xl p-6 text-center"
                >
                  <span className="font-display text-sm text-qlaf-success uppercase tracking-wider">Correct Order</span>
                  <p className="font-display text-xl md:text-2xl text-qlaf-success mt-2">
                    {(currentQuestion.answer as string[]).join(' → ')}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="font-body text-xl text-muted-foreground">
                No questions loaded for this round
              </p>
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
