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

  // Some question data uses `text` instead of `label` (e.g., Only Connect).
  // Normalize to always provide a `label` property for downstream components.
  const anyOpt = option as any;
  const label = option.label || anyOpt.text || anyOpt.label || '';
  return {
    ...option,
    label,
  };
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
