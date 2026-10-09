export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type CharacterType = 'Barnaby' | 'Leo';

export interface Character {
  name: string;
  avatarIcon: string;
  role: string;
}

export interface SentencePart {
  text: string;
  isPreposition?: boolean;
  isObject?: boolean;
}

export interface StorySentence {
  fullText: string;
  parts: SentencePart[];
}

export interface QuestionLevelConfig {
  template: string[]; // e.g., ["The riddle card is", "the clock."]
  correctAnswers: string[]; // e.g., ["behind"]
  options: string[]; // e.g., ["behind", "under", "in front of", "on"]
}

export interface QuestionData {
  character: Character;
  questionText: string;
  fullAnswer: string;
  targetPreposition: string;
  targetObject: string;
  hint: string;
  level1: QuestionLevelConfig; // 1 blank: preposition
  level2: QuestionLevelConfig; // 2 blanks: preposition + noun
  level3: QuestionLevelConfig; // 3 blanks: verb + preposition + noun
  level4Chunks: string[]; // e.g. ["The riddle card", "is", "behind", "the clock."]
  level5WordBank: string[]; // Individual words to build full sentence
}

export interface StoryPage {
  pageNumber: number;
  title: string;
  image: string;
  imageAlt: string;
  sceneTheme: string;
  sentences: StorySentence[];
  question: QuestionData;
}

export interface RetellCard {
  id: string;
  stageName: 'Beginning' | 'Problem' | 'Event' | 'Ending';
  summary: string;
  detail: string;
  correctIndex: number;
}

export interface StoryProgress {
  currentPage: number;
  score: number;
  answersHistory: {
    pageNumber: number;
    firstTryCorrect: boolean;
    attempts: number;
    answeredAt: number;
  }[];
  difficulty: DifficultyLevel;
  userReaction?: 'happy' | 'difficult' | null;
  completed: boolean;
}
