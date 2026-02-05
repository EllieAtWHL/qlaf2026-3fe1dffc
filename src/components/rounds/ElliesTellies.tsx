import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useEffect, useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { Tv } from 'lucide-react';

interface ElliesTelliesProps {
  roundId?: string;
}

export const ElliesTellies = ({ roundId }: ElliesTelliesProps) => {
  const {
    currentRoundIndex,
    showAnswer,
    currentQuestionIndex,
    gameState,
    isTransitioning
  } = useQuizStore();
  const {
    currentQuestion,
    totalQuestions
  } = useQuestions();
  const round = ROUNDS[currentRoundIndex];
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(currentQuestion?.imageUrl || '/placeholder.svg');

  // Handle image transitions between questions
  useEffect(() => {
    if (currentQuestion?.imageUrl && currentQuestion.imageUrl !== displayedImage) {
      setIsImageTransitioning(true);
      // Start static effect
      const timer = setTimeout(() => {
        setDisplayedImage(currentQuestion.imageUrl);
        // Clear static after new image loads
        setTimeout(() => {
          setIsImageTransitioning(false);
        }, 4500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion?.imageUrl, displayedImage]);

  // If we're transitioning or not in round state, don't render anything
  if (isTransitioning || gameState !== 'round') {
    return null;
  }

  const questionImage = currentQuestion?.imageUrl || '/placeholder.svg';

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header with round info */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Tv className="w-10 h-10 text-primary" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Round {currentRoundIndex + 1}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground text-glow-primary">
              {round.name}
            </h1>
          </div>
        </div>

        {/* Compact scoreboard */}
        <Scoreboard compact />
      </motion.div>

      {/* Main content area - TV Display */}
      <div className="flex-1 flex items-center justify-center py-[32px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl max-w-7xl w-full text-center md:px-8 pt-2 pb-4 px-[3px] mx-0 py-[16px]"
        >
          {currentQuestion ? (
            <>
              {/* Question number */}
              <div className="mb-6">
                <span className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Question prompt - moved above image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <p className="font-body text-2xl md:text-4xl text-foreground leading-relaxed">
                  {currentQuestion.content}
                </p>
              </motion.div>

              {/* Main content area - Animated layout */}
              <div className="relative mb-8 min-h-[400px]">
                {/* TV Container - Animated position */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={false}
                  animate={showAnswer ? "left" : "center"}
                  variants={{
                    center: {
                      x: "0%",
                      scale: 1,
                    },
                    left: {
                      x: "-25%",
                      scale: 0.8,
                    }
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <div className="relative">
                    <img
                      src="/images/ellies-tellies/telly.png"
                      alt="TV Frame"
                      className="w-full max-w-2xl h-auto"
                    />
                    
                    {/* TV Screen - Question image with authentic CRT static effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Aggressive static noise overlay - enhanced for transitions */}
                      <motion.div
                        className="absolute inset-0 w-[85%] h-[85%] rounded-lg overflow-hidden"
                        initial={{ opacity: isImageTransitioning ? 1 : 0 }}
                        animate={{ 
                          opacity: isImageTransitioning 
                            ? [1, 0.9, 0.95, 0.8, 0.6, 0.4, 0.2, 0]
                            : [0, 0.05, 0.02, 0.1, 0.08, 0.2, 0.4, 0.7, 0.9, 0]
                        }}
                        transition={{ 
                          duration: isImageTransitioning ? 4 : 4.5, 
                          times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 0.95, 1] 
                        }}
                      >
                        {/* Multiple noise layers */}
                        <div className="absolute inset-0 bg-black opacity-90" />
                        <div className="absolute inset-0 opacity-70">
                          <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" style={{ animationDuration: '0.05s' }} />
                        </div>
                        <div className="absolute inset-0 opacity-50">
                          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" style={{ animationDuration: '0.08s' }} />
                        </div>
                        {/* Random noise pattern */}
                        <div className="absolute inset-0 opacity-30" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                          backgroundSize: '4px 4px'
                        }} />
                      </motion.div>
                      
                      {/* Main image with static interference - updated for transitions */}
                      <motion.img
                        src={displayedImage}
                        alt="Question Image"
                        className="w-[85%] h-[85%] object-cover rounded-lg relative z-10"
                        initial={{ 
                          opacity: isImageTransitioning ? 0 : 0,
                          filter: isImageTransitioning 
                            ? 'blur(15px) brightness(0.05) contrast(4) saturate(0) hue-rotate(180deg)'
                            : 'blur(15px) brightness(0.05) contrast(4) saturate(0) hue-rotate(180deg)',
                          x: 0,
                          y: 0
                        }}
                        animate={{ 
                          opacity: isImageTransitioning 
                            ? [0, 0.05, 0.02, 0.1, 0.08, 0.2, 0.4, 0.7, 0.9, 1]
                            : [0, 0.05, 0.02, 0.1, 0.08, 0.2, 0.4, 0.7, 0.9, 1],
                          filter: [
                            'blur(15px) brightness(0.05) contrast(4) saturate(0) hue-rotate(180deg)',
                            'blur(18px) brightness(0.02) contrast(5) saturate(0) hue-rotate(120deg)',
                            'blur(12px) brightness(0.08) contrast(4.5) saturate(0) hue-rotate(90deg)',
                            'blur(20px) brightness(0.03) contrast(6) saturate(0.1) hue-rotate(60deg)',
                            'blur(15px) brightness(0.06) contrast(4) saturate(0) hue-rotate(30deg)',
                            'blur(10px) brightness(0.15) contrast(3) saturate(0.2) hue-rotate(15deg)',
                            'blur(8px) brightness(0.4) contrast(2.5) saturate(0.4) hue-rotate(8deg)',
                            'blur(5px) brightness(0.7) contrast(2) saturate(0.7) hue-rotate(3deg)',
                            'blur(2px) brightness(0.9) contrast(1.5) saturate(0.9) hue-rotate(1deg)',
                            'blur(0px) brightness(1) contrast(1) saturate(1) hue-rotate(0deg)'
                          ],
                          x: [0, 2, -1, 3, -2, 1, -1, 0, 0, 0],
                          y: [0, -1, 2, -1, 1, -1, 0, 0, 0, 0]
                        }}
                        transition={{
                          duration: isImageTransitioning ? 4 : 4.5,
                          ease: "easeInOut",
                          times: [0, 0.1, 0.2, 0.3, 0.4, 0.55, 0.7, 0.85, 0.95, 1]
                        }}
                        key={displayedImage} // Force re-render on image change
                      />
                      
                      {/* Heavy scanlines effect - enhanced for transitions */}
                      <motion.div
                        className="absolute inset-0 w-[85%] h-[85%] rounded-lg pointer-events-none z-20"
                        initial={{ opacity: isImageTransitioning ? 0.9 : 0.9 }}
                        animate={{ 
                          opacity: isImageTransitioning 
                            ? [0.9, 0.8, 0.85, 0.7, 0.5, 0.3, 0.1, 0]
                            : [0.9, 0.8, 0.85, 0.7, 0.5, 0.3, 0.1, 0]
                        }}
                        transition={{ 
                          duration: isImageTransitioning ? 4 : 4.5, 
                          times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 0.95, 1] 
                        }}
                      >
                        <div className="w-full h-full" style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)',
                        }} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Answer reveal - Right side, appears when answer is shown */}
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ left: '50%' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="bg-qlaf-success/20 border-2 border-qlaf-success rounded-xl p-8 w-full max-w-lg text-left"
                    >
                      <span className="font-display text-lg text-qlaf-success uppercase tracking-wider">
                        Answer
                      </span>
                      <div className="mt-4">
                        {Array.isArray(currentQuestion.answer) ? (
                          <div className="space-y-4">
                            {currentQuestion.answer.map((answerPart, index) => (
                              <div key={index} className="font-display text-2xl text-qlaf-success">
                                {answerPart}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-display text-3xl md:text-4xl text-qlaf-success">
                            {currentQuestion.answer}
                          </p>
                        )}
                      </div>
                      {currentQuestion.points && (
                        <p className="font-display text-xl text-qlaf-success/70 mt-4">
                          {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                        </p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="mb-8">
              <p className="font-body text-2xl md:text-3xl text-foreground">
                {round.description}
              </p>
              <p className="font-body text-lg text-muted-foreground mt-4">
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
