import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { RoundTransition } from '@/components/RoundTransition';
import { Scoreboard } from '@/components/Scoreboard';
import { GenericRound } from '@/components/rounds/GenericRound';
import { F1GrandPrix } from '@/components/rounds/F1GrandPrix';
import { OneMinuteRound } from '@/components/rounds/OneMinuteRound';
import { WorldRankings } from '@/components/rounds/WorldRankings';
import { PictureBoard } from '@/components/rounds/PictureBoard';
import { OnlyConnect } from '@/components/rounds/OnlyConnect';
import { LoadingScreen } from '@/components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

const componentMap: Record<string, React.ComponentType<any>> = {
  'F1GrandPrix': F1GrandPrix,
  'OneMinuteRound': OneMinuteRound,
  'WorldRankings': WorldRankings,
  'PictureBoard': PictureBoard,
  'OnlyConnect': OnlyConnect,
  'GenericRound': GenericRound,
};

export const MainDisplay = () => {
  const { gameState, currentRoundIndex, isTransitioning } = useQuizStore();
  const currentRound = ROUNDS[currentRoundIndex];
  
  console.log('[MainDisplay] Render - currentRound:', currentRound?.component);
  
  // MainDisplay should NEVER call useQuizSync - only CoHostInterface should broadcast
  // The store state is updated through the sync system automatically

  const renderRound = () => {
    // Don't render any round component if we're not in 'round' state
    if (gameState !== 'round') {
      return null;
    }
    
    const Component = componentMap[currentRound.component] || GenericRound;
    
    if (currentRound.component === 'GenericRound') {
      return <GenericRound key={`${currentRound.id}-${gameState}`} />;
    }
    
    // For PictureBoard, only use roundId in key to prevent unmounting during team transitions
    if (currentRound.component === 'PictureBoard') {
      return <Component key={currentRound.id} roundId={currentRound.id} />;
    }
    
    return <Component key={`${currentRound.id}-${gameState}`} roundId={currentRound.id} />;
  };

  const renderContent = () => {
    // If we're explicitly transitioning, show loading screen
    if (isTransitioning) {
      return <LoadingScreen />;
    }
    
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
    <div className="main-display-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="w-full h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
