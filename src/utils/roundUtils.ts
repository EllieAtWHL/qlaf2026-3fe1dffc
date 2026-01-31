import { ROUNDS } from '@/store/quizStore';

// Get round IDs from the rounds.json data - single source of truth
export const getRoundIds = (): string[] => {
  return ROUNDS.map(round => round.id);
};

// Get round ID by index
export const getRoundIdByIndex = (index: number): string => {
  const roundIds = getRoundIds();
  return roundIds[index] || '';
};
