import { useMemo } from 'react';
import { useQuizStore, RoundType } from '@/store/quizStore';
import questionsData from '@/data/questions.json';
import { Question, QuestionsData } from '@/types/questions';
import { getRoundIds } from '@/utils/roundUtils';

export const useQuestions = () => {
  const { currentRoundIndex, currentQuestionIndex } = useQuizStore();
  const rounds = useQuizStore(state => state.teams); // Just to trigger re-render
  
  const data = questionsData as unknown as QuestionsData;
  
  const roundIds: RoundType[] = getRoundIds() as RoundType[];
  
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
