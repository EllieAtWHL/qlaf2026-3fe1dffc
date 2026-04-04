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
    // Handle Picture Board round which uses 'boards' instead of 'questions'
    if (currentRoundId === 'picture-board' && currentRoundData?.boards) {
      // Return empty array for Picture Board since it has its own selection system
      return [];
    }
    
    // Handle One Minute Round which uses 'boards' instead of 'questions'
    if (currentRoundId === 'one-minute-round' && currentRoundData?.boards) {
      // Return empty array for One Minute Round since it has its own selection system
      return [];
    }
    
    return currentRoundData?.questions || [];
  }, [currentRoundData, currentRoundId]);
  
  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);
  
  const totalQuestions = questions.length;
  const hasNextQuestion = currentQuestionIndex < totalQuestions - 1;
  const hasPreviousQuestion = currentQuestionIndex > 0;
  
  const getQuestionsForRound = (roundId: string): Question[] => {
    const roundData = data[roundId];
    if (!roundData) return [];
    
    // Handle Picture Board round which uses 'boards' instead of 'questions'
    if (roundId === 'picture-board' && roundData.boards) {
      // Convert boards to a format that works with the question system
      return roundData.boards.map((board: { id: string; name: string; pictures: Array<{ imageUrl?: string }> }, index: number) => ({
        id: board.id,
        roundType: 'picture-board' as RoundType,
        type: 'picture',
        content: `Select board: ${board.name}`,
        answer: board.name,
        imageUrl: board.pictures[0]?.imageUrl || '/placeholder.svg',
        points: 0,
      }));
    }
    
    // Handle One Minute Round which uses 'boards' instead of 'questions'
    if (roundId === 'one-minute-round' && roundData.boards) {
      // Convert boards to a format that works with the question system
      return roundData.boards.map((board: { id: string; name: string; imageUrl?: string }, index: number) => ({
        id: board.id,
        roundType: 'one-minute-round' as RoundType,
        type: 'one-minute',
        content: `Select board: ${board.name}`,
        answer: board.name,
        imageUrl: board.imageUrl || '/placeholder.svg',
        points: 0,
      }));
    }
    
    return roundData.questions || [];
  };
  
  const currentRoundType = currentRoundData?.type;

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    hasNextQuestion,
    hasPreviousQuestion,
    getQuestionsForRound,
    currentRoundId,
    currentRoundType,
  };
};
