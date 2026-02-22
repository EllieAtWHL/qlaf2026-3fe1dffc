import { motion, AnimatePresence } from 'framer-motion';
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
    totalQuestions,
    getQuestionsForRound
  } = useQuestions();
  const round = ROUNDS[currentRoundIndex];
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(currentQuestion?.imageUrl || '/placeholder.svg');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnswerRevealing, setIsAnswerRevealing] = useState(false);
  
  // Preload next question image for smoother transitions
  const preloadNextImage = () => {
    const questions = getQuestionsForRound('ellies-tellies');
    const nextQuestion = questions[currentQuestionIndex + 1];
    if (nextQuestion?.imageUrl) {
      const img = new Image();
      img.src = nextQuestion.imageUrl;
    }
  };

  // Initial preload when component mounts
  useEffect(() => {
    if (currentQuestion?.imageUrl) {
      setIsImageTransitioning(true); // Show static on initial load
      setIsImageLoading(true);
      
      const img = new Image();
      img.onload = () => {
        setIsImageLoading(false);
        setTimeout(() => {
          setDisplayedImage(currentQuestion.imageUrl);
          setTimeout(() => {
            setIsImageTransitioning(false);
            // Preload next image
            preloadNextImage();
          }, 1500);
        }, 200);
      };
      img.onerror = () => {
        setImageError(true);
        setIsImageLoading(false);
        setIsImageTransitioning(false);
      };
      img.src = currentQuestion.imageUrl;
    }
  }, []); // Only run once on mount

  // Handle image transitions between questions
  useEffect(() => {
    if (currentQuestion?.imageUrl && currentQuestion.imageUrl !== displayedImage) {
      setIsImageTransitioning(true);
      setIsImageLoading(true);
      setImageError(false);
      
      // Preload new image before showing it
      const img = new Image();
      img.onload = () => {
        setIsImageLoading(false);
        // Start static effect
        const timer = setTimeout(() => {
          setDisplayedImage(currentQuestion.imageUrl);
          // Clear static after new image loads - matched to animation duration
          setTimeout(() => {
            setIsImageTransitioning(false);
            // Preload next image for smoother transitions
            preloadNextImage();
          }, 1500);
        }, 200);
        return () => clearTimeout(timer);
      };
      
      img.onerror = () => {
        setIsImageLoading(false);
        setImageError(true);
        setIsImageTransitioning(false);
      };
      
      img.src = currentQuestion.imageUrl;
    }
  }, [currentQuestion?.imageUrl, displayedImage]);

  // Trigger static effect when currentQuestionIndex changes (new question)
  useEffect(() => {
    if (currentQuestion?.imageUrl) {
      // Start with static immediately
      setIsImageTransitioning(true);
      setIsImageLoading(true);
      setImageError(false);
      
      const img = new Image();
      img.onload = () => {
        setIsImageLoading(false);
        // Show static for a moment, then transition to image
        setTimeout(() => {
          setDisplayedImage(currentQuestion.imageUrl);
          // Keep static for a bit longer while image transitions in
          setTimeout(() => {
            setIsImageTransitioning(false);
            preloadNextImage();
          }, 2000); // Match image transition duration
        }, 500); // Static duration before image appears
      };
      
      img.onerror = () => {
        setImageError(true);
        setIsImageLoading(false);
        setIsImageTransitioning(false);
      };
      
      img.src = currentQuestion.imageUrl;
    }
  }, [currentQuestionIndex]); // Trigger when question index changes

  // If we're transitioning or not in round state, don't render anything
  if (isTransitioning || gameState !== 'round') {
    return null;
  }

  const questionImage = currentQuestion?.imageUrl || '/placeholder.svg';

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-6 relative overflow-hidden h-screen">
      {/* Header with round info */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 flex-shrink-0"
      >
        <div className="flex items-center gap-4">
          <Tv className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          <div>
            <span className="font-display text-xs md:text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Round {currentRoundIndex + 1}
            </span>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground text-glow-primary">
              {round.name}
            </h1>
          </div>
        </div>

        {/* Compact scoreboard */}
        <Scoreboard compact />
      </motion.div>

      {/* Main content area - TV Display */}
      <div className="flex-1 flex items-center justify-center py-4 min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl w-full h-full max-w-6xl text-center px-2 md:px-6 py-4 flex flex-col"
        >
          {currentQuestion ? (
            <>
              {/* Question number */}
              <div className="mb-6">
                <span className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Question prompt */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 flex-shrink-0"
              >
                <p className="font-body text-lg md:text-2xl text-foreground leading-relaxed">
                  {currentQuestion.content}
                </p>
              </motion.div>

              {/* Main content area - Animated layout */}
              <div className="flex-1 relative min-h-0 flex items-center">
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
                  <div className="relative w-full h-full max-w-4xl mx-auto">
                    {/* TV Frame - separate image without screen */}
                    <img
                      src="/images/ellies-tellies/tvFrame.png"
                      alt="TV Frame"
                      className="absolute inset-0 w-full h-full object-contain z-10"
                    />
                    
                    {/* TV Screen Container - positioned exactly where screen should be */}
                    <div className="relative w-full h-full flex items-start justify-center z-20 pt-8 -mt-4">
                      <div className="relative w-[81%] h-[91%] max-w-3xl overflow-hidden bg-black shadow-2xl border-4 border-gray-800 -ml-1">
                        {/* Authentic CRT TV Static Effect */}
                        <motion.div
                          className="absolute inset-0 bg-black z-20"
                          initial={{ opacity: isImageTransitioning ? 1 : 0 }}
                          animate={{ 
                            opacity: isImageTransitioning ? 1 : 0
                          }}
                          transition={{ 
                            duration: 0.1
                          }}
                        >
                          {/* Realistic TV static with multiple layers */}
                          <div className="absolute inset-0 opacity-90">
                            {/* Fast flickering noise */}
                            <div className="w-full h-full animate-pulse" style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='2' height='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='static'%3E%3CfeTurbulence baseFrequency='2' numOctaves='4' seed='5' /%3E%3CfeColorMatrix type='saturate' values='0' /%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23static)' /%3E%3C/svg%3E")`,
                              backgroundSize: '2px 2px',
                              animationDuration: '0.05s'
                            }} />
                          </div>
                          <div className="absolute inset-0 opacity-70">
                            {/* Horizontal scanlines */}
                            <div className="w-full h-full" style={{
                              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.05) 3px)',
                              animation: 'scanlines 0.1s linear infinite'
                            }} />
                          </div>
                          <div className="absolute inset-0 opacity-50">
                            {/* Random noise bursts */}
                            <div className="w-full h-full animate-pulse" style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence baseFrequency='1.5' numOctaves='2' seed='10' /%3E%3CfeColorMatrix type='saturate' values='0' /%3E%3Cfilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)' /%3E%3C/svg%3E")`,
                              backgroundSize: '4px 4px',
                              animationDuration: '0.08s'
                            }} />
                          </div>
                          {/* Bright white flashes */}
                          <div className="absolute inset-0 opacity-30 animate-pulse" style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 70%)',
                            animationDuration: '0.15s'
                          }} />
                        </motion.div>
                        
                        {/* Question Image - Animated from static and to static */}
                        <AnimatePresence>
                          <motion.img
                            src={displayedImage}
                            alt="Question Image"
                            className="absolute inset-0 w-full h-full object-cover z-10"
                            initial={{ 
                              opacity: 0,
                              filter: 'brightness(0) contrast(5) saturate(0) blur(2px)',
                            }}
                            animate={{ 
                              opacity: 1,
                              filter: 'brightness(1) contrast(1) saturate(1) blur(0px)',
                            }}
                            exit={{
                              opacity: 0,
                              filter: 'brightness(0) contrast(5) saturate(0) blur(2px)',
                            }}
                            transition={{
                              duration: 2,
                              ease: "easeInOut",
                            }}
                            key={displayedImage}
                          />
                        </AnimatePresence>
                        
                        {/* Loading indicator */}
                        {isImageLoading && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-black/90 z-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="text-center">
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-primary text-sm font-display">Tuning Channel...</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Error state */}
                        {imageError && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-red-900/90 z-30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="text-center">
                              <p className="text-red-200 text-sm font-display mb-2">Signal Lost</p>
                              <p className="text-red-300 text-xs">Unable to load image</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Subtle scanlines overlay (always visible for CRT effect) */}
                        <div className="absolute inset-0 pointer-events-none z-15 opacity-20 rounded-3xl overflow-hidden">
                          <div className="w-full h-full" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
                          }} />
                        </div>
                      </div>
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
