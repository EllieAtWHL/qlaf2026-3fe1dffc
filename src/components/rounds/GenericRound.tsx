import { motion } from 'framer-motion';
import { Timer } from '@/components/Timer';
import { Scoreboard } from '@/components/Scoreboard';
import { useQuizStore, ROUNDS } from '@/store/quizStore';
import { useQuestions } from '@/hooks/useQuestions';
import { normalizeOption } from '@/types/questions';
interface GenericRoundProps {
  roundId?: string; // Make optional since we'll read from store
}
export const GenericRound = ({
  roundId
}: GenericRoundProps) => {
  const {
    currentRoundIndex,
    showAnswer,
    currentQuestionIndex,
    gameState,
    isTransitioning
  } = useQuizStore();
  const {
    currentQuestion,
    totalQuestions
  } = useQuestions();
  const round = ROUNDS[currentRoundIndex];

  // If we're transitioning or not in round state, don't render anything
  if (isTransitioning || gameState !== 'round') {
    return null;
  }
  return <div className="min-h-screen qlaf-bg flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header with round info and timer */}
      <motion.div initial={{
      opacity: 0,
      y: -30
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Round info */}
        <div>
          <span className="font-display text-sm text-muted-foreground uppercase tracking-[0.3em]">
            Round {currentRoundIndex + 1}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground text-glow-primary">
            {round.name}
          </h1>
        </div>

        {/* Compact scoreboard */}
        <Scoreboard compact />
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 items-center justify-center flex flex-row">
        <motion.div key={currentQuestionIndex} initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.1
      }} className="glass-card rounded-2xl max-w-4xl w-full text-center md:px-8 pt-2 pb-4 px-[3px] py-[32px] mx-0">
          {currentQuestion ? <>
              {/* Question number */}
              <div className="mb-4">
                <span className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              
              {/* Question content */}
              <motion.div key={`q-${currentQuestionIndex}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="mb-8">
                <p className="font-body text-2xl md:text-4xl text-foreground leading-relaxed">
                  {currentQuestion.content}
                </p>
                
                {/* Options if available */}
                {currentQuestion.options && <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                const normalized = normalizeOption(option);
                return <motion.div key={normalized.label} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.1 * index
                }} className="glass-card p-4 rounded-xl text-lg font-display flex items-center gap-4">
                          {normalized.imageUrl && <img src={normalized.imageUrl} alt={normalized.label} className="w-12 h-8 object-cover rounded shadow-md" />}
                          <div>
                            <span className="text-primary mr-2">{String.fromCharCode(65 + index)}.</span>
                            {normalized.label}
                          </div>
                        </motion.div>;
              })}
                  </div>}
              </motion.div>
              
              {/* Answer reveal */}
              {showAnswer && <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="bg-qlaf-success/20 border-2 border-qlaf-success rounded-xl p-8 mx-[16px] my-[16px]">
                  <span className="font-display text-lg text-qlaf-success uppercase tracking-wider">Answer</span>
                  {Array.isArray(currentQuestion.answer) ? currentQuestion.answer.length > 10 ? <div className="mt-2 max-h-56 overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                          {currentQuestion.answer.map((answer, index) => {
                  const answerObj = typeof answer === 'object' ? answer : {
                    name: answer,
                    event: ''
                  };
                  return <div key={index} className="font-display text-base text-qlaf-success">
                                <div className="font-semibold text-lg">{answerObj.name}</div>
                                {answerObj.event && <div className="text-sm text-qlaf-success/70 mt-1">{answerObj.event}</div>}
                              </div>;
                })}
                        </div>
                      </div> : <div className="font-display text-3xl md:text-4xl text-qlaf-success mt-4">
                        {currentQuestion.answer.map((answer, index) => {
                const answerObj = typeof answer === 'object' ? answer : {
                  name: answer,
                  event: ''
                };
                return <div key={index} className="mb-3">
                              <div>{answerObj.name}</div>
                              {answerObj.event && <div className="text-lg text-qlaf-success/70">{answerObj.event}</div>}
                            </div>;
              })}
                      </div> : <p className="font-display text-3xl md:text-4xl text-qlaf-success mt-4">
                      {currentQuestion.answer}
                    </p>}
                  {currentQuestion.points && <p className="font-display text-xl text-qlaf-success/70 mt-4">
                      {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                    </p>}
                </motion.div>}
            </> : <div className="mb-8">
              <p className="font-body text-2xl md:text-3xl text-foreground">
                {round.description}
              </p>
              <p className="font-body text-lg text-muted-foreground mt-4">
                No questions loaded for this round
              </p>
            </div>}

          {/* Timer for timed rounds */}
          {round.timerDuration && <div className="flex justify-center mt-8">
              <Timer />
            </div>}
        </motion.div>
      </div>

      {/* QLAF branding */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="font-display text-sm text-muted-foreground/50 tracking-[0.5em]">
          QLAF 2026
        </span>
      </div>
    </div>;
};