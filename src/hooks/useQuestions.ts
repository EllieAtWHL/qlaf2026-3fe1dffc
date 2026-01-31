import { useMemo } from 'react';
import { useQuizStore, RoundType } from '@/store/quizStore';
import questionsData from '@/data/questions.json';
import { Question, QuestionsData } from '@/types/questions';

export const useQuestions = () => {
  const { currentRoundIndex, currentQuestionIndex } = useQuizStore();
  const rounds = useQuizStore(state => state.teams); // Just to trigger re-render
  
  const data = questionsData as unknown as QuestionsData;
  
  const roundIds: RoundType[] = [
    'world-rankings',
    'just-one', 
    'picture-board',
    'only-connect',
    'round-robin',
    'daves-dozen',
    'ellies-tellies',
    'distinctly-average',
    'wipeout',
    'one-minute-round',
    'f1-grand-prix'
  ];
  
  const currentRoundId = roundIds[currentRoundIndex];
  const currentRoundData = data[currentRoundId];
  
  const questions = useMemo(() => {
    return currentRoundData?.questions || [];
  }, [currentRoundData]);
  
  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);
  
  const totalQuestions = questions.length;
  const hasNextQuestion = currentQuestionIndex < totalQuestions - 1;
  const hasPreviousQuestion = currentQuestionIndex > 0;
  
  const getQuestionsForRound = (roundId: string): Question[] => {
    return data[roundId]?.questions || [];
  };
  
  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    hasNextQuestion,
    hasPreviousQuestion,
    getQuestionsForRound,
    currentRoundId,
  };
};
