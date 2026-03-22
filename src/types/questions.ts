import { RoundType } from '@/store/quizStore';

export interface QuestionOption {
  label: string;
  sublabel?: string;
  imageUrl?: string;
  order?: number;
  answer?: string;
}

// Wipeout-specific option format
export interface WipeoutOption {
  text: string;
  correct: boolean;
}

export interface ChrisStadiaCard {
  id: number;
  stadium: string;
  visitType: 'work' | 'watch' | 'not_visited';
  reason: string;
}

export interface Question {
  id: string;
  content: string;
  options?: (string | QuestionOption | WipeoutOption)[];
  answer: string | string[];
  answers?: Array<{
    number: number;
    text: string;
    imageUrl: string;
  }>;
  cards?: ChrisStadiaCard[];
  correctOrder?: string[];
  imageUrl?: string;
  points: number;
  stadium?: string; // Chris Stadia specific property
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
  type: 'single' | 'ranking' | 'picture' | 'connection' | 'auction' | 'average' | 'wipeout' | 'quickfire' | 'f1' | 'reveal';
  questions?: Question[];
  boards?: PictureBoard[];
}

export type QuestionsData = Record<RoundType, RoundQuestions>;
