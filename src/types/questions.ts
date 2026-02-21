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
  answers?: Array<{
    number: number;
    text: string;
    imageUrl: string;
  }>;
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

export interface PictureBoard {
  id: string;
  name: string;
  imageUrl: string;
  pictures: Array<{
    id: number;
    answer: string;
    imageUrl: string;
  }>;
}

export interface RoundQuestions {
  title: string;
  questions?: Question[];
  boards?: PictureBoard[];
}

export type QuestionsData = Record<RoundType, RoundQuestions>;
