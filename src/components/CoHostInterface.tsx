import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { 
  ChevronLeft, ChevronRight, 
  Trophy, Plus, Minus, Eye, EyeOff, Home, Car,
  SkipForward, Clock, Wifi, WifiOff, HelpCircle, Image, Link,
  Bug, X, Grid3X3, RotateCcw
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import React from 'react';
import { useQuizSync } from '@/hooks/useQuizSync';
import { useQuestions } from '@/hooks/useQuestions';
import { normalizeOption } from '@/types/questions';

export const CoHostInterface = () => {
  const {
    gameState,
    currentRoundIndex,
    currentQuestionIndex,
    teams,
    f1Positions,
    showAnswer,
    startGame,
    startRound,
    nextRound,
    previousRound,
    goToRound,
    showScores,
    showTransition,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTeamScore,
    advanceF1Car,
    toggleAnswer,
    nextQuestion,
    previousQuestion,
    resetGame,
    // Picture Board specific
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
    // Only Connect specific
    onlyConnectRevealedOptions,
    revealOnlyConnectOption,
    resetOnlyConnect,
  } = useQuizStore();

  const { broadcastAction } = useQuizSync(true);
  const { currentQuestion, totalQuestions, hasNextQuestion, hasPreviousQuestion, getQuestionsForRound } = useQuestions();
  const [scoreInputs, setScoreInputs] = useState<{ [key: string]: string }>({});
  const [isConnected, setIsConnected] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  // Create a stable copy of options for display to prevent reordering
  const stableOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    
    // Create a deep copy and preserve original order by storing original indices
    const optionsWithOriginalIndex = currentQuestion.options.map((option, index) => {
      if (typeof option === 'string') {
        return {
          label: option,
          _originalIndex: index
        };
      } else {
        return {
          ...option,
          _originalIndex: index
        };
      }
    });
    
    // Sort by original index to ensure display order is always maintained
    return optionsWithOriginalIndex.sort((a, b) => (a._originalIndex || 0) - (b._originalIndex || 0));
  }, [currentQuestion?.id, currentQuestion?.options]);

  // Auto-start timer for picture board when first picture is displayed - OPTIMIZED
  useEffect(() => {
    // Only run for picture board round
    if (ROUNDS[currentRoundIndex]?.id !== 'picture-board') {
      return;
    }
    
    // Check if a board is selected and this is the first picture
    const hasBoardSelected = selectedBoards[currentTeamSelecting];
    const isFirstPicture = currentPictureIndex === 0;
    const notShowingAll = !showAllPictures;
    
    // Use a debounced approach to prevent rapid state changes
    if (hasBoardSelected && isFirstPicture && notShowingAll) {
      // Small delay to ensure state is stable before starting timer
      const timeoutId = setTimeout(() => {
        // Double-check conditions haven't changed
        if (selectedBoards[currentTeamSelecting] && currentPictureIndex === 0 && !showAllPictures) {
          startTimer();
          broadcastAction('startTimer');
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedBoards[currentTeamSelecting], currentTeamSelecting, currentPictureIndex, showAllPictures, currentRoundIndex, broadcastAction]);

  // Wrapper functions that both update local state AND broadcast to main display
  const syncedStartGame = () => {
    startGame();
    broadcastAction('startGame');
  };

  const syncedStartRound = () => {
    startRound();
    broadcastAction('startRound');
  };

  const syncedNextRound = () => {
    nextRound();
    broadcastAction('nextRound');
  };

  const syncedPreviousRound = () => {
    previousRound();
    broadcastAction('previousRound');
  };

  const syncedGoToRound = (index: number) => {
    goToRound(index);
    broadcastAction('goToRound', { index });
  };

  const syncedShowScores = () => {
    showScores();
    broadcastAction('showScores');
  };

  const syncedShowTransition = () => {
    showTransition();
    broadcastAction('showTransition');
  };

  
  const syncedToggleAnswer = () => {
    toggleAnswer();
    broadcastAction('toggleAnswer');
  };

  const syncedResetGame = () => {
    resetGame();
    broadcastAction('resetGame');
  };

  const syncedAdvanceF1Car = (teamId: number, amount: number) => {
    advanceF1Car(teamId, amount);
    broadcastAction('advanceF1Car', { teamId, amount });
  };

  const syncedSelectBoard = (teamId: number, boardId: string) => {
    selectBoard(teamId, boardId);
    broadcastAction('selectBoard', { teamId, boardId });
  };

  const [isTimeUpProcessing, setIsTimeUpProcessing] = useState(false);

  const syncedTeamTimeUp = () => {
    if (isTimeUpProcessing) return;
    
    setIsTimeUpProcessing(true);
    teamTimeUp();
    broadcastAction('teamTimeUp');
    
    // Reset after a short delay to prevent multiple calls
    setTimeout(() => setIsTimeUpProcessing(false), 500);
  };

  const syncedNextPicture = () => {
    console.log('[syncedNextPicture] Button clicked!', {
      showAllPictures,
      currentPictureIndex,
      timestamp: new Date().toISOString()
    });
    const startTime = performance.now();
    nextPicture();
    broadcastAction('nextPicture');
    const endTime = performance.now();
    console.log(`[syncedNextPicture] Total time: ${endTime - startTime}ms`);
  };

  const syncedPreviousPicture = () => {
    previousPicture();
    broadcastAction('previousPicture');
  };

  const syncedResetPictureBoard = () => {
    resetPictureBoard();
    broadcastAction('resetPictureBoard');
  };

  const syncedRevealOnlyConnectOption = () => {
    revealOnlyConnectOption();
    broadcastAction('revealOnlyConnectOption');
  };

  const syncedResetOnlyConnect = () => {
    resetOnlyConnect();
    broadcastAction('resetOnlyConnect');
  };

  const debouncedRevealOnlyConnectOption = () => {
    if (isRevealing || onlyConnectRevealedOptions >= 4) return;
    
    setIsRevealing(true);
    revealOnlyConnectOption();
    broadcastAction('revealOnlyConnectOption');
    
    // Prevent double-clicks for 500ms
    setTimeout(() => setIsRevealing(false), 500);
  };

  // Dave's Dozen synced functions
  const syncedRevealDavesDozenAnswer = (answerNumber: number) => {
    broadcastAction('revealDavesDozenAnswer', { answerNumber });
  };

  const syncedShowIncorrectAnswer = () => {
    broadcastAction('showIncorrectAnswer');
  };

  const syncedResetDavesDozen = () => {
    broadcastAction('resetDavesDozen');
  };

  const canAdvanceToNextRound = () => {
    const nextRoundIndex = currentRoundIndex + 1;
    console.log('[CoHostInterface] canAdvanceToNextRound:', {
      currentRoundIndex,
      nextRoundIndex,
      totalRounds: ROUNDS.length
    });
    
    if (nextRoundIndex < ROUNDS.length) {
      const nextRound = ROUNDS[nextRoundIndex];
      const nextRoundQuestions = getQuestionsForRound(nextRound.id);
      console.log('[CoHostInterface] Next round check:', {
        nextRoundId: nextRound.id,
        nextRoundName: nextRound.name,
        questionCount: nextRoundQuestions.length
      });
      return nextRoundQuestions.length > 0;
    }
    console.log('[CoHostInterface] Next round index out of bounds');
    return false;
  };

  const syncedNextQuestion = () => {
    if (hasNextQuestion) {
      nextQuestion();
      broadcastAction('nextQuestion');
    } else if (canAdvanceToNextRound()) {
      // Don't call nextQuestion since there are no more questions
      // Just advance to the next round directly
      console.log('[CoHostInterface] Advancing to next round from syncedNextQuestion');
      syncedNextRound();
    } else {
      console.log('[CoHostInterface] No more questions and cannot advance to next round');
    }
  };

  const syncedPreviousQuestion = () => {
    if (hasPreviousQuestion) {
      previousQuestion();
      broadcastAction('previousQuestion');
    }
  };

  const currentRound = ROUNDS[currentRoundIndex];

  // Initialize score inputs when round changes
  useEffect(() => {
    const inputs: { [key: string]: string } = {};
    teams.forEach(team => {
      inputs[`${team.id}-${currentRoundIndex}`] = team.scores[currentRoundIndex].toString();
    });
    setScoreInputs(inputs);
  }, [currentRoundIndex, teams]);

  const handleScoreChange = (teamId: number, value: string) => {
    const key = `${teamId}-${currentRoundIndex}`;
    setScoreInputs(prev => ({ ...prev, [key]: value }));
    const numValue = parseInt(value) || 0;
    updateTeamScore(teamId, currentRoundIndex, numValue);
    broadcastAction('updateTeamScore', { teamId, roundIndex: currentRoundIndex, score: numValue });
  };

  const adjustScore = (teamId: number, delta: number) => {
    const key = `${teamId}-${currentRoundIndex}`;
    const currentValue = parseInt(scoreInputs[key]) || 0;
    const newValue = Math.max(0, currentValue + delta);
    handleScoreChange(teamId, newValue.toString());
  };

  const teamColors = ['bg-team-1', 'bg-team-2', 'bg-team-3'];

  return (
    <div className="min-h-screen qlaf-bg p-4 pb-safe">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xs text-muted-foreground uppercase tracking-widest">
              QLAF 2026 CO-HOST CONTROLS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${isConnected ? 'bg-qlaf-success/20 text-qlaf-success' : 'bg-destructive/20 text-destructive'}`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'Synced' : 'Offline'}
            </div>
            <button
              onClick={syncedResetGame}
              className="p-3 rounded-lg bg-destructive/20 text-destructive"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quiz Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">
            Quiz Control
          </h3>
          {gameState !== 'welcome' && (
            <div className="text-xs text-muted-foreground text-right">
              <div className="font-semibold">{currentRoundIndex + 1}/{ROUNDS.length}</div>
              <div>{currentRound?.name}</div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {gameState === 'welcome' && (
            <button
              onClick={syncedStartGame}
              className="col-span-2 control-btn bg-qlaf-success text-white"
            >
              Start Game
            </button>
          )}
          
          {gameState !== 'welcome' && (
            <>
              <button
                onClick={syncedStartRound}
                disabled={gameState === 'round'}
                className="col-span-2 control-btn bg-qlaf-success/20 text-qlaf-success border border-qlaf-success/30 disabled:opacity-30"
              >
                {gameState === 'round' ? 'Round In Progress' : 'Play Round'}
              </button>
              <button
                onClick={syncedShowScores}
                className="col-span-2 control-btn bg-qlaf-gold/20 text-qlaf-gold border border-qlaf-gold/30"
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                Scores
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Question Controls */}
      {totalQuestions > 0 && gameState === 'round' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Questions
            </h3>
            <span className="text-xs text-muted-foreground">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          
          {currentQuestion && (
            <div className="bg-secondary/30 rounded-lg p-3 mb-3">
              <p className="text-sm text-foreground line-clamp-2">{currentQuestion.content}</p>
              
              {/* Show options in the same order as main display */}
              {stableOptions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {stableOptions.map((option, index) => {
                    const normalized = normalizeOption(option);
                    
                    return (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <div className="flex-1">
                          <div className="text-foreground line-clamp-2">{normalized.label}</div>
                          {normalized.sublabel && (
                            <div className="text-muted-foreground text-xs mt-0.5">{normalized.sublabel}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={syncedPreviousQuestion}
              disabled={!hasPreviousQuestion}
              className="control-btn bg-secondary text-foreground disabled:opacity-30 text-sm"
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Prev
            </button>
            <button
              onClick={syncedNextQuestion}
              disabled={!hasNextQuestion && !canAdvanceToNextRound()}
              className="control-btn bg-secondary text-foreground disabled:opacity-30 text-sm"
            >
              {hasNextQuestion ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </>
              ) : canAdvanceToNextRound() ? (
                <>
                  Next R
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </>
              ) : (
                <>
                  End
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Only Connect Controls */}
      {currentRound?.id === 'only-connect' && gameState === 'round' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-xl p-4 mb-4"
        >
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Link className="w-4 h-4" />
            Only Connect - Progressive Reveal
          </h3>
          
          <div className="space-y-3">
            {/* Current State */}
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground mb-1">
                Clues Revealed: {onlyConnectRevealedOptions}/4
              </p>
              <p className="text-xs text-muted-foreground">
                Points available: {[5, 3, 2, 1][onlyConnectRevealedOptions - 1] || 1}
              </p>
            </div>
            
            {/* Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={debouncedRevealOnlyConnectOption}
                disabled={onlyConnectRevealedOptions >= 4 || isRevealing}
                className="control-btn bg-qlaf-warning text-white disabled:opacity-30 text-sm"
              >
                {isRevealing ? 'Revealing...' : 'Reveal Next Clue'}
              </button>
              <button
                onClick={syncedResetOnlyConnect}
                className="control-btn bg-secondary text-foreground text-sm"
              >
                Reset Clues
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Answer for Co-host (Always Visible) */}
      {totalQuestions > 0 && gameState === 'round' && currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-card rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-qlaf-success" />
              <h3 className="font-display text-sm text-qlaf-success uppercase tracking-wider">
                Answer
              </h3>
            </div>
            <button
              onClick={syncedToggleAnswer}
              className={`control-btn ${showAnswer ? 'bg-qlaf-success text-white' : 'bg-accent/20 text-accent'} text-xs`}
            >
              {showAnswer ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
              {showAnswer ? 'Hide' : 'Show'} On Screen
            </button>
          </div>
          
          <div className="bg-qlaf-success/10 border border-qlaf-success/30 rounded-lg p-3">
            <p className="text-sm text-foreground font-medium">
              {currentQuestion.type === 'ranking' && currentQuestion.options
                ? (currentQuestion.options as any[])
                    .sort((a, b) => (a.order || 999) - (b.order || 999))
                    .map((opt, index) => `${index + 1}. ${opt.label} (${opt.answer || 'No answer'})`)
                    .join(' → ')
                : Array.isArray(currentQuestion.answer) 
                  ? currentQuestion.answer.map((answer: any) => {
                      if (answer && typeof answer === 'object' && 'name' in answer) {
                        return answer.name || answer.answer || 'No answer';
                      }
                      return answer || 'No answer';
                    }).join(', ')
                  : currentQuestion.answer || 'No answer available'}
            </p>
            {currentQuestion.points && (
              <p className="text-xs text-qlaf-success/70 mt-2">
                {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Picture Board Controls */}
      {currentRound?.id === 'picture-board' && gameState === 'round' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card rounded-xl p-4 mb-4"
        >
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Image className="w-4 h-4" />
            {currentTeamSelecting <= 3 ? 'Picture Board - Current Selection' : 'Picture Board - Complete'}
          </h3>
          
          {currentTeamSelecting <= 3 ? (
            <>
              {/* Debug info */}
              <div className="text-xs text-muted-foreground mb-2">
                Available boards: {availableBoards.length} | Picture boards loaded: {pictureBoards.length}
              </div>
              
              {/* Board Selection */}
              {!selectedBoards[currentTeamSelecting] && availableBoards.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Select a board for the current player:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {availableBoards.map((boardId) => {
                      const board = pictureBoards.find(b => b.id === boardId);
                      if (!board) return null;
                      
                      return (
                        <button
                          key={boardId}
                          onClick={() => syncedSelectBoard(currentTeamSelecting, boardId)}
                          className="control-btn bg-secondary text-foreground text-left justify-start"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          {board.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Current Board Display */}
              {selectedBoards[currentTeamSelecting] && (
                <div className="space-y-3">
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground">
                      Current Board: {pictureBoards.find(b => b.id === selectedBoards[currentTeamSelecting])?.name}
                    </p>
                  </div>
                  
                  {/* Picture Navigation */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {showAllPictures ? 
                        "Showing all pictures" : 
                        `Picture ${currentPictureIndex + 1} of ${pictureBoards.find(b => b.id === selectedBoards[currentTeamSelecting])?.pictures.length || 12}`
                      }
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={syncedPreviousPicture}
                        disabled={currentPictureIndex === 0 && !showAllPictures}
                        className="control-btn bg-secondary text-foreground disabled:opacity-30 text-xs"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          console.log('[Button] onClick triggered!', new Date().toISOString());
                          syncedNextPicture();
                        }}
                        disabled={showAllPictures}
                        className="control-btn bg-secondary text-foreground disabled:opacity-30 text-xs"
                      >
                        {showAllPictures ? "All Shown" : "Next"}
                      </button>
                      <button
                        onClick={syncedResetPictureBoard}
                        className="control-btn bg-secondary text-foreground text-xs"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  {/* Current Picture Answer */}
                  {!showAllPictures && currentBoard && (
                    <div className="bg-qlaf-success/10 border border-qlaf-success/30 rounded-lg p-3">
                      <p className="text-xs font-semibold text-qlaf-success mb-1">Answer:</p>
                      <p className="text-sm text-foreground font-medium">
                        {currentBoard.pictures[currentPictureIndex]?.answer || "No answer"}
                      </p>
                    </div>
                  )}
                  
                  {/* All Answers Grid */}
                  {showAllPictures && currentBoard && (
                    <div className="bg-qlaf-success/10 border border-qlaf-success/30 rounded-lg p-3">
                      <p className="text-xs font-semibold text-qlaf-success mb-2">All Answers:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {currentBoard.pictures.map((picture, index) => (
                          <div key={picture.id} className="flex items-start gap-1">
                            <span className="text-muted-foreground">{index + 1}.</span>
                            <span className="text-foreground">{picture.answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={currentTeamSelecting === 3 ? syncedNextRound : syncedTeamTimeUp}
                    className={`control-btn ${currentTeamSelecting === 3 ? 'bg-qlaf-success' : 'bg-qlaf-warning'} text-white w-full`}
                  >
                    {currentTeamSelecting === 3 ? (
                      <>
                        <SkipForward className="w-4 h-4 inline mr-2" />
                        Next Round
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 inline mr-2" />
                        Next Team
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Selection Status */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Selection Status:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[1, 2, 3].map(teamId => (
                    <div key={teamId} className="text-center">
                      <div className="font-semibold">Board {teamId}</div>
                      <div className={selectedBoards[teamId] ? 'text-qlaf-success' : 'text-muted-foreground'}>
                        {selectedBoards[teamId] 
                          ? pictureBoards.find(b => b.id === selectedBoards[teamId])?.name 
                          : 'Not selected'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Picture Board Complete - Show Next Round Button */
            <div className="space-y-3">
              <div className="bg-qlaf-success/10 border border-qlaf-success/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-qlaf-success mb-1">Picture Board Complete!</p>
                <p className="text-xs text-foreground">All teams have finished their picture boards.</p>
              </div>
              <button
                onClick={syncedNextRound}
                className="control-btn bg-qlaf-success text-white w-full"
              >
                <SkipForward className="w-4 h-4 inline mr-2" />
                Next Round
              </button>
            </div>
          )}
        </motion.div>
      )}

      
      {/* Team Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-4 mb-4"
      >
        <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Round Scores
        </h3>
        
        <div className="space-y-3">
          {teams.map((team, index) => (
            <div key={team.id} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${teamColors[index]}`} />
              <span className="font-display text-sm flex-1">{team.name}</span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustScore(team.id, -1)}
                  className="w-11 h-11 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={scoreInputs[`${team.id}-${currentRoundIndex}`] || 0}
                  onChange={(e) => handleScoreChange(team.id, e.target.value)}
                  className="w-16 h-11 rounded-lg bg-input text-center font-display text-lg border-none"
                />
                <button
                  onClick={() => adjustScore(team.id, 1)}
                  className="w-11 h-11 rounded-lg bg-qlaf-success/20 text-qlaf-success flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-12 text-right">
                <span className="font-display text-lg font-bold text-primary">
                  {team.totalScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dave's Dozen Controls */}
      {currentRound?.id === 'daves-dozen' && gameState === 'round' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-xl p-4 mb-4"
        >
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Dave's Dozen - Answer Selection
          </h3>
          
          <div className="space-y-3">
            {/* Answer Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {currentQuestion?.answers?.map((answer: any) => (
                <button
                  key={answer.number}
                  onClick={() => syncedRevealDavesDozenAnswer(answer.number)}
                  className="control-btn bg-secondary text-foreground text-xs p-3 flex flex-col items-center gap-1"
                >
                  <span className="font-bold text-lg">{answer.number}</span>
                  <span className="text-xs leading-tight">{answer.text}</span>
                </button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={syncedShowIncorrectAnswer}
                className="control-btn bg-red-500 text-white text-xs"
              >
                <X className="w-4 h-4 inline mr-1" />
                Incorrect
              </button>
              <button
                onClick={syncedResetDavesDozen}
                className="control-btn bg-secondary text-foreground text-xs"
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* F1 Controls (only for F1 round) */}
      {currentRound?.id === 'f1-grand-prix' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-xl p-4"
        >
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Car className="w-4 h-4" />
            F1 Car Positions
          </h3>
          
          <div className="space-y-3">
            {teams.map((team, index) => (
              <div key={team.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${teamColors[index]}`} />
                <span className="font-display text-sm flex-1">{team.name}</span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => syncedAdvanceF1Car(team.id, 5)}
                    className="control-btn py-2 px-4 bg-qlaf-success/20 text-qlaf-success text-sm"
                  >
                    +5%
                  </button>
                  <button
                    onClick={() => syncedAdvanceF1Car(team.id, 10)}
                    className="control-btn py-2 px-4 bg-qlaf-success/30 text-qlaf-success text-sm"
                  >
                    +10%
                  </button>
                </div>
                
                <span className="font-display text-lg font-bold w-12 text-right">
                  {Math.round(f1Positions[index])}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Debug Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug Panel
          </h3>
          <span className="text-xs text-muted-foreground">For testing only</span>
        </div>
        
        {/* State Information */}
        <div className="space-y-2 mb-4">
          <div className="bg-secondary/30 rounded-lg p-2">
            <p className="text-xs font-mono text-muted-foreground">
              Game State: <span className="text-foreground font-semibold">{gameState}</span>
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Round: <span className="text-foreground font-semibold">{currentRoundIndex + 1}/{ROUNDS.length} ({currentRound?.id})</span>
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Question: <span className="text-foreground font-semibold">{currentQuestionIndex + 1}/{totalQuestions || 0}</span>
            </p>
                        <p className="text-xs font-mono text-muted-foreground">
              Show Answer: <span className="text-foreground font-semibold">{showAnswer ? 'true' : 'false'}</span>
            </p>
            {currentRound?.id === 'picture-board' && (
              <>
                <p className="text-xs font-mono text-muted-foreground">
                  Team Selecting: <span className="text-foreground font-semibold">{currentTeamSelecting}</span>
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  Picture Index: <span className="text-foreground font-semibold">{currentPictureIndex}</span>
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  Show All Pictures: <span className="text-foreground font-semibold">{showAllPictures ? 'true' : 'false'}</span>
                </p>
              </>
            )}
            {currentRound?.id === 'only-connect' && (
              <p className="text-xs font-mono text-muted-foreground">
                Revealed Options: <span className="text-foreground font-semibold">{onlyConnectRevealedOptions}/4</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Round Jump Controls */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold">Jump to Round:</p>
          <div className="grid grid-cols-2 gap-1">
            {ROUNDS.map((round, index) => (
              <button
                key={round.id}
                onClick={() => syncedGoToRound(index)}
                className={`control-btn text-xs p-2 ${
                  currentRoundIndex === index 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                }`}
              >
                {index + 1}. {round.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground font-semibold mb-2">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => syncedGoToRound(0)}
              className="control-btn bg-secondary text-foreground text-xs"
            >
              First Round
            </button>
            <button
              onClick={() => syncedGoToRound(ROUNDS.length - 1)}
              className="control-btn bg-secondary text-foreground text-xs"
            >
              Last Round
            </button>
            <button
              onClick={() => {
                syncedToggleAnswer();
                syncedToggleAnswer(); // Toggle twice to ensure it's shown
              }}
              className="control-btn bg-qlaf-success/20 text-qlaf-success text-xs"
            >
              Force Show Answer
            </button>
            <button
              onClick={() => {
                syncedToggleAnswer();
                if (showAnswer) syncedToggleAnswer(); // Hide if currently shown
              }}
              className="control-btn bg-destructive/20 text-destructive text-xs"
            >
              Force Hide Answer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
