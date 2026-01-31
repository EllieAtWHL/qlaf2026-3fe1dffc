import { RoundType } from '@/store/quizStore';

export interface QuestionOption {
  label: string;
  sublabel?: string;
  imageUrl?: string;
  order?: number;
  answer?: string;
}

export interface Question {
  id: string;
  type: 'single' | 'ranking' | 'picture' | 'connection' | 'auction' | 'average' | 'wipeout' | 'quickfire' | 'f1';
  content: string;
  options?: (string | QuestionOption)[];
  answer: string | string[];
  correctOrder?: string[];
  imageUrl?: string;
  points: number;
}

// Helper to normalize options to always have label/imageUrl
export const normalizeOption = (option: string | QuestionOption): QuestionOption => {
  if (typeof option === 'string') {
    return { label: option };
  }
  return option;
};

export interface RoundQuestions {
  title: string;
  questions: Question[];
}

export type QuestionsData = Record<RoundType, RoundQuestions>;
