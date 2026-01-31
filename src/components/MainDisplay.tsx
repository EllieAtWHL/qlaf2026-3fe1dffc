import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { RoundTransition } from '@/components/RoundTransition';
import { Scoreboard } from '@/components/Scoreboard';
import { GenericRound } from '@/components/rounds/GenericRound';
import { F1GrandPrix } from '@/components/rounds/F1GrandPrix';
import { OneMinuteRound } from '@/components/rounds/OneMinuteRound';
import { WorldRankings } from '@/components/rounds/WorldRankings';
import { PictureBoard } from '@/components/rounds/PictureBoard';
import { motion, AnimatePresence } from 'framer-motion';

export const MainDisplay = () => {
  const { gameState, currentRoundIndex } = useQuizStore();
  const currentRound = ROUNDS[currentRoundIndex];

  const renderRound = () => {
    switch (currentRound.id) {
      case 'f1-grand-prix':
        return <F1GrandPrix />;
      case 'one-minute-round':
        return <OneMinuteRound />;
      case 'world-rankings':
        return <WorldRankings />;
      case 'picture-board':
        return <PictureBoard />;
      default:
        return <GenericRound roundId={currentRound.id} />;
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'round-transition':
        return <RoundTransition />;
      case 'round':
        return renderRound();
      case 'scores':
        return (
          <div className="min-h-screen qlaf-bg flex items-center justify-center p-4 md:p-8">
            <Scoreboard showRoundScores />
          </div>
        );
      case 'final':
        return <F1GrandPrix />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${gameState}-${currentRoundIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};
