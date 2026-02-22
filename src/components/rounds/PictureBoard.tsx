import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';
import { Image } from 'lucide-react';
import { useEffect } from 'react';

export const PictureBoard = () => {
  const {
    currentRoundIndex,
    showAnswer,
    selectedBoards,
    currentTeamSelecting,
    pictureBoards,
    currentBoard,
    currentPictureIndex,
    showAllPictures,
    initializePictureBoards,
    selectBoard,
    teamTimeUp,
    nextPicture,
    previousPicture,
    resetPictureBoard,
    startTimer
  } = useQuizStore();

  const round = ROUNDS[currentRoundIndex];

  // Preload all images from current board to eliminate first-time load delays
  useEffect(() => {
    if (currentBoard) {
      currentBoard.pictures.forEach((picture) => {
        const img = document.createElement('img');
        img.src = picture.imageUrl;
      });
    }
  }, [currentBoard]);

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
            Picture Board Complete!
          </h1>
          <p className="font-body text-xl text-muted-foreground mb-6">
            All teams have finished their picture boards.
          </p>
          <p className="font-body text-lg text-muted-foreground">
            Use the co-host controls to advance to the next round.
          </p>
        </motion.div>
      </div>
    );
  }
  
  // Show board selection UI if current team hasn't selected a board yet
  if (!selectedBoards[currentTeamSelecting]) {
    return (
      <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-qlaf-blue/20 to-qlaf-purple/20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Picture Board</h1>
            <p className="text-xl text-white/90">Team {currentTeamSelecting} - Select Your Board</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {pictureBoards.map((board, index) => (
              <motion.div
                key={board.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-white/5">
                  <img 
                    src={board.imageUrl} 
                    alt={board.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{board.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading if no current board
  if (!currentBoard) {
    return <div className="min-h-screen qlaf-bg flex items-center justify-center text-white">Loading board...</div>;
  }
  
  const currentPicture = currentBoard.pictures[currentPictureIndex];

  return (
    <div className="main-display-round qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Image className="w-10 h-10 text-primary" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Current Board
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow-primary">
              {currentBoard.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {round.timerDuration && <Timer compact />}
          <Scoreboard compact />
        </div>
      </motion.div>

      {/* Picture display */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          key={`${currentPictureIndex}-${showAllPictures}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="w-full h-full max-w-6xl max-h-[60vh]"
        >
          {showAllPictures ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              {/* Show all pictures in a grid - 4x3 with rectangular images */}
              <div className="grid grid-cols-4 gap-1 md:gap-2 w-full h-full">
                {currentBoard.pictures.map((picture, index) => (
                  <div
                    key={picture.id}
                    className="aspect-video glass-card rounded-lg p-1 flex items-center justify-center relative"
                  >
                    {/* Picture number circle in top-right corner */}
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                      <span className="font-display text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <img 
                      src={picture.imageUrl} 
                      alt={picture.answer}
                      className="w-full h-full object-cover rounded"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Show single picture - much larger */}
              <div className="w-full h-full max-h-[45vh] glass-card rounded-xl p-0 flex items-center justify-center relative">
                {/* Picture number circle in top-right corner */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center z-10">
                  <span className="font-display text-lg font-bold text-primary-foreground">
                    {currentPictureIndex + 1}
                  </span>
                </div>
                <img 
                  src={currentPicture.imageUrl} 
                  alt={currentPicture.answer}
                  className="w-full h-full object-contain rounded"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Answer display */}
      {showAnswer && currentPicture && (
        <div className="text-center mb-4">
          <div className="font-display text-2xl text-qlaf-success">
            {currentPicture.answer}
          </div>
        </div>
      )}

      {/* QLAF branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="font-display text-sm text-muted-foreground/50 tracking-[0.5em]">
          QLAF 2026
        </span>
      </div>
    </div>
  );
};
