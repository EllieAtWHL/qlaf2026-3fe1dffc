import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  Trophy, Plus, Minus, Eye, EyeOff, Home, Car,
  SkipForward, Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const CoHostInterface = () => {
  const {
    gameState,
    currentRoundIndex,
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
    resetGame,
  } = useQuizStore();

  const [scoreInputs, setScoreInputs] = useState<{ [key: string]: string }>({});
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
          <button
            onClick={resetGame}
            className="p-2 rounded-lg bg-destructive/20 text-destructive"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Game State Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-4 mb-4"
      >
        <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Game State
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {gameState === 'welcome' && (
            <button
              onClick={startGame}
              className="col-span-2 control-btn bg-qlaf-success text-white"
            >
              Start Game
            </button>
          )}
          
          {gameState !== 'welcome' && (
            <>
              <button
                onClick={showTransition}
                className="control-btn bg-primary/20 text-primary border border-primary/30"
              >
                Show Round
              </button>
              <button
                onClick={startRound}
                className="control-btn bg-qlaf-success/20 text-qlaf-success border border-qlaf-success/30"
              >
                Play Round
              </button>
              <button
                onClick={showScores}
                className="control-btn bg-qlaf-gold/20 text-qlaf-gold border border-qlaf-gold/30"
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                Scores
              </button>
              <button
                onClick={toggleAnswer}
                className={`control-btn ${showAnswer ? 'bg-accent/20 text-accent border-accent/30' : 'bg-muted text-muted-foreground'} border`}
              >
                {showAnswer ? <Eye className="w-4 h-4 inline mr-2" /> : <EyeOff className="w-4 h-4 inline mr-2" />}
                Answer
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Round Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4 mb-4"
      >
        <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Round {currentRoundIndex + 1}/{ROUNDS.length}: {currentRound?.name}
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={previousRound}
            disabled={currentRoundIndex === 0}
            className="flex-1 control-btn bg-secondary text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 inline" />
            Prev
          </button>
          <button
            onClick={nextRound}
            disabled={currentRoundIndex === ROUNDS.length - 1}
            className="flex-1 control-btn bg-secondary text-foreground disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-5 h-5 inline" />
          </button>
        </div>

        {/* Round quick select */}
        <div className="mt-3 grid grid-cols-6 gap-1">
          {ROUNDS.map((round, index) => (
            <button
              key={round.id}
              onClick={() => goToRound(index)}
              className={`p-2 rounded text-xs font-display ${
                index === currentRoundIndex 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Timer Controls */}
      {currentRound?.timerDuration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timer
            </h3>
            <span className={`font-display text-2xl font-bold ${
              timerValue <= 10 ? 'text-qlaf-danger' : timerValue <= 30 ? 'text-qlaf-warning' : 'text-qlaf-success'
            }`}>
              {Math.floor(timerValue / 60)}:{(timerValue % 60).toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={isTimerRunning ? pauseTimer : startTimer}
              className={`control-btn ${isTimerRunning ? 'bg-qlaf-warning' : 'bg-qlaf-success'} text-white`}
            >
              {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => resetTimer()}
              className="control-btn bg-secondary text-foreground"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => resetTimer(30)}
              className="control-btn bg-secondary text-foreground text-sm"
            >
              30s
            </button>
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
                    onClick={() => advanceF1Car(team.id, 5)}
                    className="control-btn py-2 px-4 bg-qlaf-success/20 text-qlaf-success text-sm"
                  >
                    +5%
                  </button>
                  <button
                    onClick={() => advanceF1Car(team.id, 10)}
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
