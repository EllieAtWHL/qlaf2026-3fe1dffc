import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useEffect, useState, useRef } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { Scoreboard } from '@/components/Scoreboard';
import { Timer } from '@/components/Timer';
import { Image, Users, Clock } from 'lucide-react';

const BoardSelection = () => {
  // This component shows available boards on the main screen
  const { availableBoards, selectedBoards, currentTeamSelecting, pictureBoards } = useQuizStore();
  
  const currentTeamBoardId = selectedBoards[currentTeamSelecting];
  const currentTeamBoard = pictureBoards.find(board => board.id === currentTeamBoardId);
  
  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Users className="w-10 h-10 text-primary" />
          <div>
            <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
              Board Selection
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow-primary">
              Choose Your Board
            </h1>
          </div>
        </div>
      </motion.div>
      
      {/* Available Boards */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {availableBoards.map((boardId, index) => {
            const board = pictureBoards.find(b => b.id === boardId);
            if (!board) return null;
            
            return (
              <motion.div
                key={boardId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="text-center">
                  {/* Board Image */}
                  <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-secondary/50">
                    <img 
                      src={board.imageUrl} 
                      alt={board.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {board.name}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm">
                    12 Pictures
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Selection Status */}
      <div className="mt-8">
        <div className="glass-card rounded-xl p-4 max-w-2xl mx-auto">
          <h3 className="font-display text-lg font-bold text-foreground mb-3 text-center">
            Board Selection Status
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(teamId => (
              <div key={teamId} className="text-center">
                <div className="font-display text-sm text-muted-foreground mb-1">
                  Board {teamId}
                </div>
                <div className="font-body text-foreground">
                  {selectedBoards[teamId] ? (
                    <span className="text-qlaf-success">
                      {pictureBoards.find(b => b.id === selectedBoards[teamId])?.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not selected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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

export const PictureBoard = () => {
  const {
    currentRoundIndex,
    showAnswer,
    availableBoards,
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
  const previousBoardId = useRef<string | null>(null);
  
  console.log('[PictureBoard] Render:', {
    currentTeamSelecting,
    selectedBoards,
    availableBoards,
    pictureBoardsLength: pictureBoards.length,
    currentPictureIndex,
    showAllPictures,
    currentBoardName: currentBoard?.name,
    currentBoardPictures: currentBoard?.pictures.length
  });
  
  // Log what should be displayed
  const shouldShowIndividual = !showAllPictures && currentBoard && currentPictureIndex < currentBoard.pictures.length;
  const shouldShowGrid = showAllPictures && currentBoard;
  
  console.log('[PictureBoard] Display Logic:', {
    shouldShowIndividual,
    shouldShowGrid,
    currentPictureIndex,
    showAllPictures,
    hasCurrentBoard: !!currentBoard
  });
  
  // Reset picture board state when a new board is selected
  useEffect(() => {
    const currentBoardId = selectedBoards[currentTeamSelecting];
    if (currentBoardId && currentBoardId !== previousBoardId.current) {
      previousBoardId.current = currentBoardId;
      resetPictureBoard();
    }
  }, [selectedBoards, currentTeamSelecting]);
  
  // Start timer when first picture is shown
  useEffect(() => {
    if (currentBoard && currentPictureIndex === 0 && !showAllPictures) {
      console.log('[PictureBoard] Starting timer for first picture');
      startTimer();
    }
  }, [currentBoard, currentPictureIndex, showAllPictures]);
  
  // Show completion message when all teams are done
  if (currentTeamSelecting === 4) {
    console.log('[PictureBoard] All teams completed, showing completion message');
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
    console.log('[PictureBoard] Showing board selection for current player', {
      currentTeamSelecting,
      selectedBoards,
      hasBoardForCurrentTeam: !!selectedBoards[currentTeamSelecting]
    });
    // Render board selection inline instead of separate component to prevent unmounting
    return (
      <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-qlaf-blue/20 to-qlaf-purple/20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Picture Board</h1>
            <p className="text-xl text-white/90">Team {currentTeamSelecting} - Select Your Board</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {availableBoards.map((boardId, index) => {
              const board = pictureBoards.find(b => b.id === boardId);
              if (!board) return null;
              
              return (
                <motion.div
                  key={boardId}
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
              );
            })}
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Team Selection Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(teamId => (
                <div key={teamId} className="text-center">
                  <div className="font-semibold text-white">Team {teamId}</div>
                  <div className={selectedBoards[teamId] ? 'text-qlaf-success' : 'text-white/70'}>
                    {selectedBoards[teamId] 
                      ? pictureBoards.find(b => b.id === selectedBoards[teamId])?.name 
                      : 'Not selected'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show the selected board for the current team
  if (!currentBoard) {
    console.log('[PictureBoard] No current board available');
    return <div>Loading board...</div>;
  }
  
  const currentPicture = currentBoard.pictures[currentPictureIndex];
  
  console.log('[PictureBoard] About to render:', {
    showAllPictures,
    currentPictureIndex,
    totalPictures: currentBoard.pictures.length,
    currentPictureExists: !!currentPicture
  });

  return (
    <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
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
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-4xl"
        >
          {showAllPictures ? (
            <div>
              <p style={{color: 'red', fontSize: '20px', fontWeight: 'bold'}}>SHOWING ALL PICTURES</p>
              {/* Show all pictures in a grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {currentBoard.pictures.map((picture, index) => (
                  <motion.div
                    key={picture.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="aspect-square glass-card rounded-lg p-2 flex items-center justify-center"
                  >
                    <img 
                      src={picture.imageUrl} 
                      alt={picture.answer}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p style={{color: 'blue', fontSize: '20px', fontWeight: 'bold'}}>SHOWING INDIVIDUAL PICTURE {currentPictureIndex + 1}</p>
              {/* Show single picture */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square glass-card rounded-xl p-8 flex items-center justify-center"
              >
                <img 
                  src={currentPicture.imageUrl} 
                  alt={currentPicture.answer}
                  className="w-full h-full object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Picture navigation info */}
      <div className="text-center mb-4">
        <div className="font-display text-lg text-foreground">
          {showAllPictures ? (
            "All Pictures"
          ) : (
            `Picture ${currentPictureIndex + 1} of ${currentBoard.pictures.length}`
          )}
        </div>
        {showAnswer && currentPicture && (
          <div className="font-display text-2xl text-qlaf-success mt-2">
            {currentPicture.answer}
          </div>
        )}
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
