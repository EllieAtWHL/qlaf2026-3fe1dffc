import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { MapPin, Trophy, Plane, EyeOff } from 'lucide-react';
import { ChrisStadiaCard } from '@/types/questions';
import { GameCard, RevealGameCard } from '@/components/ui/GameCard';

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
    return showAnswer && card.reason;
  };

  const getVisitIcon = (visitType: string) => {
    switch (visitType) {
      case 'sporting_event':
        return <Trophy className="w-5 h-5" />;
      case 'fly_by':
        return <Plane className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getVisitColor = (visitType: string) => {
    switch (visitType) {
      case 'sporting_event':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'fly_by':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
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
      <div className="flex-1 flex items-center justify-center px-2 md:px-4 max-h-[75vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full max-w-6xl"
        >
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 h-full" data-testid="chris-stadia-grid">
          {cards.map((card, index) => {
            const revealed = isRevealed(card.id);
            
            return (
              <RevealGameCard
                key={card.id}
                revealed={revealed}
                onClick={() => {
                  // This will be handled by CoHostInterface
                }}
                borderColor={revealed ? (
                  card.visitType === 'sporting_event' ? 'rgb(34 197 94 / 0.5)' :
                  card.visitType === 'fly_by' ? 'rgb(59 130 246 / 0.5)' :
                  'transparent'
                ) : 'transparent'}
                backgroundColor={revealed ? (
                  card.visitType === 'sporting_event' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  card.visitType === 'fly_by' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  'bg-primary text-primary-foreground'
                ) : 'bg-primary text-primary-foreground'}
                iconAnimation={true}
                icon={
                  revealed ? (
                    card.visitType === 'sporting_event' ? <Trophy className="w-5 h-5" /> :
                    card.visitType === 'fly_by' ? <Plane className="w-5 h-5" /> :
                    <MapPin className="w-5 h-5" />
                  ) : null
                }
              >
                {revealed ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="w-full h-full flex flex-col items-center justify-center text-center"
                  >
                    {/* Stadium Name */}
                    <h3 className="font-display text-sm font-bold text-foreground mb-1 line-clamp-2">
                      {card.stadium}
                    </h3>
                    
                    {/* Visit Type Badge */}
                    <div className={`text-xs px-2 py-1 rounded-full mb-2 ${getVisitColor(card.visitType)}`}>
                      {card.visitType === 'sporting_event' && 'Sporting Event'}
                      {card.visitType === 'fly_by' && 'Fly By'}
                    </div>
                    
                    {/* Reason */}
                    {shouldShowReason(card) && card.reason && (
                      <motion.p 
                        className="font-body text-xs text-muted-foreground line-clamp-3 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.2 }}
                      >
                        {card.reason}
                      </motion.p>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-md md:text-base font-medium text-center text-primary-foreground">
                    {card.stadium}
                  </div>
                )}
              </RevealGameCard>
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
