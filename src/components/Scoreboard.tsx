import { motion } from 'framer-motion';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { Trophy } from 'lucide-react';

interface ScoreboardProps {
  showRoundScores?: boolean;
  compact?: boolean;
}

export const Scoreboard = ({ showRoundScores = false, compact = false }: ScoreboardProps) => {
  const { teams, currentRoundIndex } = useQuizStore();

  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);

  const teamColors = [
    'from-red-500 to-red-600',
    'from-green-500 to-green-600',
    'from-yellow-500 to-yellow-600',
  ];

  const teamBgColors = [
    'bg-team-1/20 border-team-1/40',
    'bg-team-2/20 border-team-2/40',
    'bg-team-3/20 border-team-3/40',
  ];

  if (compact) {
    return (
      <div className="flex gap-4 justify-center">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card rounded-lg px-4 py-2 ${teamBgColors[team.id - 1]}`}
          >
            <div className="font-display text-sm text-muted-foreground">{team.name}</div>
            <div className={`font-display text-2xl font-bold bg-gradient-to-r ${teamColors[team.id - 1]} bg-clip-text text-transparent`}>
              {team.totalScore}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="scoreboard rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-qlaf-gold" />
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow-gold">
          SCOREBOARD
        </h2>
        <Trophy className="w-8 h-8 text-qlaf-gold" />
      </div>

      {/* Team scores */}
      <div className="space-y-4">
        {sortedTeams.map((team, rank) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.1 }}
            className={`glass-card rounded-xl p-4 border-2 ${teamBgColors[team.id - 1]} ${rank === 0 ? 'ring-2 ring-qlaf-gold/50' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xl
                  ${rank === 0 ? 'bg-qlaf-gold text-black' : rank === 1 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'}`}
                >
                  {rank + 1}
                </div>
                
                {/* Team name */}
                <span className="font-display text-xl md:text-2xl font-bold text-foreground">
                  {team.name}
                </span>
              </div>

              {/* Total score */}
              <div className={`font-display text-3xl md:text-4xl font-black bg-gradient-to-r ${teamColors[team.id - 1]} bg-clip-text text-transparent`}>
                {team.totalScore}
              </div>
            </div>

            {/* Round scores breakdown */}
            {showRoundScores && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-4 pt-4 border-t border-border/50"
              >
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
                  {team.scores.slice(0, currentRoundIndex + 1).map((score, roundIdx) => (
                    <div key={roundIdx} className="text-center">
                      <div className="text-xs text-muted-foreground font-body truncate">
                        R{roundIdx + 1}
                      </div>
                      <div className="font-display font-bold text-foreground">
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Current round indicator */}
      <div className="mt-6 text-center">
        <span className="font-body text-muted-foreground">
          After Round {currentRoundIndex + 1}: {ROUNDS[currentRoundIndex]?.name}
        </span>
      </div>
    </motion.div>
  );
};
