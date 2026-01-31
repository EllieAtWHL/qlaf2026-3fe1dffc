import { RoundType } from '@/store/quizStore';

export interface Question {
  id: string;
  type: 'single' | 'ranking' | 'picture' | 'connection' | 'auction' | 'average' | 'wipeout' | 'quickfire' | 'f1';
  content: string;
  options?: string[];
  answer: string | string[];
  imageUrl?: string;
  points: number;
}

export interface RoundQuestions {
  title: string;
  questions: Question[];
}

export type QuestionsData = Record<RoundType, RoundQuestions>;
