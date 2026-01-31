import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  Trophy, Plus, Minus, Eye, EyeOff, Home, Car,
  SkipForward, Clock, Wifi, WifiOff, HelpCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuizSync } from '@/hooks/useQuizSync';
import { useQuestions } from '@/hooks/useQuestions';

export const CoHostInterface = () => {
  const {
    gameState,
    currentRoundIndex,
    currentQuestionIndex,
    isTimerRunning,
    timerValue,
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
  } = useQuizStore();

  const { broadcastAction } = useQuizSync(true);
  const { currentQuestion, totalQuestions, hasNextQuestion, hasPreviousQuestion, getQuestionsForRound } = useQuestions();
  const [scoreInputs, setScoreInputs] = useState<{ [key: string]: string }>({});
  const [isConnected, setIsConnected] = useState(true);

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

  const syncedStartTimer = () => {
    startTimer();
    broadcastAction('startTimer');
  };

  const syncedPauseTimer = () => {
    pauseTimer();
    broadcastAction('pauseTimer');
  };

  const syncedResetTimer = (duration?: number) => {
    resetTimer(duration);
    broadcastAction('resetTimer', { duration });
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

  const canAdvanceToNextRound = () => {
    const nextRoundIndex = currentRoundIndex + 1;
    if (nextRoundIndex < ROUNDS.length) {
      const nextRoundQuestions = getQuestionsForRound(ROUNDS[nextRoundIndex].id);
      return nextRoundQuestions.length > 0;
    }
    return false;
  };

  const syncedNextQuestion = () => {
    if (hasNextQuestion) {
      nextQuestion();
      broadcastAction('nextQuestion');
    } else if (canAdvanceToNextRound()) {
      // Don't call nextQuestion since there are no more questions
      // Just advance to the next round directly
      syncedNextRound();
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
              CO-HOST CONTROLS
            </span>
            <h1 className="font-display text-lg font-bold text-primary">
              QLAF 2026
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${isConnected ? 'bg-qlaf-success/20 text-qlaf-success' : 'bg-destructive/20 text-destructive'}`}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'Synced' : 'Offline'}
            </div>
            <button
              onClick={syncedResetGame}
              className="p-2 rounded-lg bg-destructive/20 text-destructive"
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
              {showAnswer && (
                <p className="text-sm text-qlaf-success mt-2 font-semibold">
                  Answer: {currentQuestion.type === 'ranking' && currentQuestion.options
                    ? (currentQuestion.options as any[])
                        .sort((a, b) => (a.order || 999) - (b.order || 999))
                        .map((opt, index) => `${index + 1}. ${opt.label} (${opt.answer})`)
                        .join(' → ')
                    : Array.isArray(currentQuestion.answer) 
                      ? currentQuestion.answer.map(answer => 
                          typeof answer === 'object' && answer !== null ? answer.name : answer
                        ).join(', ')
                      : currentQuestion.answer}
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={syncedPreviousQuestion}
              disabled={!hasPreviousQuestion}
              className="control-btn bg-secondary text-foreground disabled:opacity-30 text-sm"
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Prev
            </button>
            <button
              onClick={syncedToggleAnswer}
              className={`control-btn ${showAnswer ? 'bg-qlaf-success text-white' : 'bg-accent/20 text-accent'} text-sm`}
            >
              {showAnswer ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
              {showAnswer ? 'Hide' : 'Show'}
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

      {/* Timer Controls */}
      {currentRound?.timerDuration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-3 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className={`font-display text-xl font-bold ${
                timerValue <= 10 ? 'text-qlaf-danger' : timerValue <= 30 ? 'text-qlaf-warning' : 'text-qlaf-success'
              }`}>
                {Math.floor(timerValue / 60)}:{(timerValue % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={isTimerRunning ? syncedPauseTimer : syncedStartTimer}
                className={`p-2 rounded-lg ${isTimerRunning ? 'bg-qlaf-warning text-white' : 'bg-qlaf-success text-white'}`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => syncedResetTimer()}
                className="p-2 rounded-lg bg-secondary text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => syncedResetTimer(30)}
                className="p-2 rounded-lg bg-secondary text-foreground text-xs font-semibold"
              >
                30s
              </button>
            </div>
          </div>
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
                  className="w-8 h-8 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={scoreInputs[`${team.id}-${currentRoundIndex}`] || 0}
                  onChange={(e) => handleScoreChange(team.id, e.target.value)}
                  className="w-16 h-8 rounded-lg bg-input text-center font-display text-lg border-none"
                />
                <button
                  onClick={() => adjustScore(team.id, 1)}
                  className="w-8 h-8 rounded-lg bg-qlaf-success/20 text-qlaf-success flex items-center justify-center"
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
    </div>
  );
};
