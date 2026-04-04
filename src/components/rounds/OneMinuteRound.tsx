import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useQuizStore, ROUNDS, OneMinuteBoard } from '@/store/quizStore';
import { Timer } from '@/components/Timer';
import { Clock, Image } from 'lucide-react';
import { BoardSelection } from '@/components/shared/BoardSelection';

export const OneMinuteRound = () => {
  const {
    currentRoundIndex,
    showAnswer,
    selectedBoards,
    currentTeamSelecting,
    availableBoards,
    oneMinuteBoards,
    currentBoard,
    currentQuestionIndex,
    logoBlurLevel,
    revealedFillBlanks,
    selectOneMinuteBoard,
    nextOneMinuteQuestion,
    revealLogo,
    revealFillBlank,
    initializeOneMinuteBoards,
    selectBoard,
    teamTimeUp,
    nextQuestion,
    resetOneMinuteRound,
    startTimer,
    isTimerRunning
  } = useQuizStore();

  const round = ROUNDS[currentRoundIndex];
  const logoRevealInterval = useRef<NodeJS.Timeout | null>(null);

  // Debug logging
  console.log('OneMinuteRound Debug:', {
    currentRoundIndex,
    roundId: round?.id,
    roundName: round?.name,
    currentBoard,
    availableBoardsLength: availableBoards.length,
    oneMinuteBoardsLength: oneMinuteBoards.length,
    shouldShowBoardSelection: !currentBoard,
    boardsForSelectionLength: availableBoards.map(boardId => 
      oneMinuteBoards.find(board => board.id === boardId)
    ).filter(Boolean).length
  });
  
  console.log('OneMinuteRound - availableBoards:', availableBoards);
  console.log('OneMinuteRound - oneMinuteBoards count:', oneMinuteBoards.length);

  // Auto-reveal logo on timer when in logo question phase
  useEffect(() => {
    // Only run auto-reveal during logo question phase (index 3)
    if (currentQuestionIndex === 3 && currentBoard && logoBlurLevel > 0 && isTimerRunning) {
      console.log('Starting auto logo reveal from blur level:', logoBlurLevel);
      
      // Clear any existing interval
      if (logoRevealInterval.current) {
        clearInterval(logoRevealInterval.current);
      }
      
      // Gradually reduce blur every 2 seconds
      logoRevealInterval.current = setInterval(() => {
        const { logoBlurLevel: currentBlur } = useQuizStore.getState();
        
        if (currentBlur > 0) {
          const newBlur = Math.max(0, currentBlur - 4); // Reduce by 4 each time
          console.log('Auto revealing logo - blur level:', currentBlur, '->', newBlur);
          useQuizStore.setState({ logoBlurLevel: newBlur });
        } else {
          // Stop when fully revealed
          if (logoRevealInterval.current) {
            clearInterval(logoRevealInterval.current);
            logoRevealInterval.current = null;
          }
        }
      }, 2000); // Every 2 seconds
    }
    
    return () => {
      if (logoRevealInterval.current) {
        clearInterval(logoRevealInterval.current);
        logoRevealInterval.current = null;
      }
    };
  }, [currentQuestionIndex, currentBoard, logoBlurLevel, isTimerRunning]);

  // Ensure proper state when component mounts (especially when jumping via debug panel)
  useEffect(() => {
    console.log('OneMinuteRound: useEffect - checking state');
    
    // If we're in One Minute Round but state is not properly initialized, fix it
    if (round.id === 'one-minute-round') {
      const actuallyNeedsInit = !oneMinuteBoards || oneMinuteBoards.length === 0;
      
      if (actuallyNeedsInit) {
        console.log('OneMinuteRound: initializing state due to missing data');
        initializeOneMinuteBoards();
      } else {
        console.log('OneMinuteRound: state is good, no initialization needed');
      }
    }
  }, [currentRoundIndex]); // Only run when round index changes

  // Show board selection screen
  if (!currentBoard) {
    return (
      <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-qlaf-blue/20 to-qlaf-purple/20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">One Minute Round</h1>
            <p className="text-xl text-white/90">Select Your Question Set</p>
          </div>
          
          <BoardSelection
            title="One Minute Round - Current Selection"
            boards={availableBoards.map(boardId => 
              oneMinuteBoards.find(board => board.id === boardId)
            ).filter(Boolean)}
            onSelectBoard={selectOneMinuteBoard}
            boardType="one-minute-round"
          />
        </div>
      </div>
    );
  }

  // Show current board indicator and gameplay content

  // Show completion message when all teams are done
  if (currentTeamSelecting === 4) {
    return (
      <div className="min-h-screen qlaf-bg flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-xl p-8 max-w-2xl text-center"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            One Minute Round Complete!
          </h1>
          <p className="text-xl text-muted-foreground">
            All teams have completed their questions
          </p>
        </motion.div>
      </div>
    );
  }

  const boardData = currentBoard as OneMinuteBoard;

  const renderContent = () => {
    // Phase 1: First 3 oral questions (not displayed on main screen)
    if (currentQuestionIndex < 3) {
      return (
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Question {currentQuestionIndex + 1}
          </h2>
        </div>
      );
    }

    // Phase 2: Logo reveal
    if (currentQuestionIndex === 3) {
      return (
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {boardData.logoQuestion.question}
          </h2>
          <div className="flex justify-center mb-2">
            <div 
              className="relative w-64 h-64 bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                filter: `blur(${logoBlurLevel}px)`,
                transition: 'filter 0.5s ease-in-out'
              }}
            >
              <img 
                src={boardData.logoQuestion.imageUrl} 
                alt="Sports logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      );
    }

    // Phase 3: Next 2 oral questions (not displayed on main screen)
    if (currentQuestionIndex < 6) {
      return (
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Question {currentQuestionIndex + 1}
          </h2>
        </div>
      );
    }

    // Phase 4: Fill in the blank
    return (
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold text-foreground mb-1">
          Fill in the Blank
        </h2>
        <div className="text-2xl text-primary mb-2 font-semibold">
          Category: {boardData.fillInTheBlank.category}
        </div>
        
        <div className="space-y-2">
          {boardData.fillInTheBlank.personalities.map((personality) => {
            const isRevealed = revealedFillBlanks?.includes(personality.id);
            
            return (
              <motion.div
                key={personality.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold"
              >
                <span className="text-foreground">
                  {isRevealed 
                    ? personality.visiblePart.replace(/_____+/g, personality.blankPart)
                    : personality.visiblePart
                  }
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-1 md:p-2">
      <div className="flex-shrink-0 pt-8 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-xl p-4 max-w-4xl w-full mx-auto"
        >
          {renderContent()}
        </motion.div>
      </div>

      <Timer />
    </div>
  );
};
