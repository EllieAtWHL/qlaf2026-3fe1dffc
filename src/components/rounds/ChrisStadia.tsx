import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { MapPin, Briefcase, Eye, EyeOff, Trophy } from 'lucide-react';
import { ChrisStadiaCard } from '@/types/questions';

export const ChrisStadia = () => {
  const {
    currentRoundIndex,
    showAnswer,
    gameState,
    isTransitioning,
    chrisStadiaRevealedCards,
    chrisStadiaWatchRevealed,
    chrisStadiaWatchShownOnScreen
  } = useQuizStore();

  const { currentQuestion } = useQuestions();
  const round = ROUNDS[currentRoundIndex];

  // If we're transitioning or not in round state, don't render anything
  if (isTransitioning || gameState !== 'round') {
    return null;
  }

  // Defensive check for question and cards
  if (!currentQuestion || !currentQuestion.cards) {
    return (
      <div className="main-display-round qlaf-bg flex flex-col items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="font-body text-xl text-muted-foreground">Loading Chris Stadia round...</p>
        </div>
      </div>
    );
  }

  const cards = currentQuestion.cards as ChrisStadiaCard[];
  const revealedCards = chrisStadiaRevealedCards || [];
  const watchRevealed = chrisStadiaWatchRevealed || [];
  const watchShownOnScreen = chrisStadiaWatchShownOnScreen || [];

  const isRevealed = (cardId: number) => revealedCards.includes(cardId);
  const isWatchReasonRevealed = (cardId: number) => watchRevealed.includes(cardId);
  const isWatchReasonShownOnScreen = (cardId: number) => watchShownOnScreen.includes(cardId);
  const shouldShowReason = (card: ChrisStadiaCard) => {
    return showAnswer || (card.visitType === 'watch' && isWatchReasonShownOnScreen(card.id));
  };

  const getVisitIcon = (visitType: string) => {
    switch (visitType) {
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      case 'watch':
        return <Eye className="w-5 h-5" />;
      case 'not_visited':
        return <EyeOff className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getVisitColor = (visitType: string) => {
    switch (visitType) {
      case 'work':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'watch':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'not_visited':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

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
            <MapPin className="w-6 h-6 text-primary" />
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

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-body text-2xl md:text-4xl text-foreground leading-relaxed">
          {currentQuestion.stadium}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full max-w-6xl"
      >
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 h-full">
          {cards.map((card, index) => {
            const revealed = isRevealed(card.id);
            
            return (
              <motion.div
                key={card.id}
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
                  transition-colors duration-300
                  ${revealed 
                    ? `${getVisitColor(card.visitType)} border-opacity-100` 
                    : 'bg-accent/20 border-accent/40 hover:bg-accent/30 hover:border-accent/60'
                  }
                `}
              >
                {/* Card Content */}
                <div className="p-3 flex flex-col items-center justify-center h-full text-center">
                  {revealed ? (
                    <>
                      {/* Stadium Icon */}
                      <div className="mb-2">
                        {getVisitIcon(card.visitType)}
                      </div>
                      
                      {/* Stadium Name */}
                      <h3 className="font-display text-sm font-bold text-foreground mb-1 line-clamp-2">
                        {card.stadium}
                      </h3>
                      
                      {/* Visit Type Badge */}
                      <div className={`text-xs px-2 py-1 rounded-full mb-2 ${getVisitColor(card.visitType)}`}>
                        {card.visitType === 'work' && 'Work'}
                        {card.visitType === 'watch' && 'Watch'}
                        {card.visitType === 'not_visited' && 'Not Visited'}
                      </div>
                      
                      {/* Reason */}
                      {shouldShowReason(card) && card.reason && (
                        <p className="font-body text-xs text-muted-foreground line-clamp-3">
                          {card.reason}
                        </p>
                      )}
                      {card.visitType === 'watch' && !shouldShowReason(card) && (
                        <p className="font-body text-xs text-muted-foreground italic line-clamp-3">
                          Bonus available
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Hidden State */}
                      <div className="flex flex-col items-center justify-center">
                        <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="font-body text-lg font-bold text-muted-foreground mt-1">
                          {card.stadium}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Reveal Animation Overlay */}
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-black/10 pointer-events-none"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
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
