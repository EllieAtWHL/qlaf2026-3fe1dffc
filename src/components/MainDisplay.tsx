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
import { ElliesTellies } from '@/components/rounds/ElliesTellies';
import { DavesDozen } from '@/components/rounds/DavesDozen';
import { Wipeout } from '@/components/rounds/Wipeout';
import { ChrisStadia } from '@/components/rounds/ChrisStadia';
import { LoadingScreen } from '@/components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import questionsData from '@/data/questions.json';

// Preload all images for the quiz
const preloadAllImages = async () => {
  let totalImages = 0;
  let loadedImages = 0;
  
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        loadedImages++;
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        loadedImages++; // Count as loaded even on error to avoid hanging
        resolve();
      };
      img.src = src;
      totalImages++;
    });
  };
  
  const imagePromises: Promise<void>[] = [];
  
  // Preload World Rankings images
  const worldRankings = questionsData['world-rankings']?.questions || [];
  worldRankings.forEach((question: any) => {
    question.options?.forEach((option: any) => {
      if (option.imageUrl) {
        imagePromises.push(preloadImage(option.imageUrl));
      }
    });
  });
  
  // Preload Picture Board images
  const pictureBoards = questionsData['picture-board']?.boards || [];
  pictureBoards.forEach((board: any) => {
    // Preload board thumbnail
    if (board.imageUrl) {
      imagePromises.push(preloadImage(board.imageUrl));
    }
    
    // Preload all pictures in the board
    board.pictures?.forEach((picture: any) => {
      if (picture.imageUrl) {
        imagePromises.push(preloadImage(picture.imageUrl));
      }
    });
  });
  
  // Preload Ellie's Tellies images
  const elliesTellies = questionsData['ellies-tellies']?.questions || [];
  elliesTellies.forEach((question: any) => {
    if (question.imageUrl) {
      imagePromises.push(preloadImage(question.imageUrl));
    }
  });
  
  // Preload One Minute Round logo images
  const oneMinuteBoards = questionsData['one-minute-round']?.boards || [];
  oneMinuteBoards.forEach((board: any) => {
    if (board.logoQuestion?.imageUrl) {
      imagePromises.push(preloadImage(board.logoQuestion.imageUrl));
    }
  });
  
  // Preload placeholder image
  imagePromises.push(preloadImage('/placeholder.svg'));
  
  // Wait for all images to load
  await Promise.all(imagePromises);
  
  console.log(`Preloaded ${loadedImages}/${totalImages} images successfully`);
  return totalImages;
};

const componentMap: Record<string, React.ComponentType<any>> = {
  'F1GrandPrix': F1GrandPrix,
  'OneMinuteRound': OneMinuteRound,
  'WorldRankings': WorldRankings,
  'PictureBoard': PictureBoard,
  'OnlyConnect': OnlyConnect,
  'ElliesTellies': ElliesTellies,
  'DavesDozen': DavesDozen,
  'Wipeout': Wipeout,
  'ChrisStadia': ChrisStadia,
  'GenericRound': GenericRound,
};

export const MainDisplay = () => {
  const { gameState, currentRoundIndex, isTransitioning } = useQuizStore();
  const currentRound = ROUNDS[currentRoundIndex];
  
  // Preload images on mount
  useEffect(() => {
    preloadAllImages().catch(console.error);
  }, []);
  
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
