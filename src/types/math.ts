export type TopicId = 
  | 'dictado'
  | 'patrones'
  | 'unidades-decenas'
  | 'conteo'
  | 'orden'
  | 'problemas';

export interface TopicInfo {
  id: TopicId;
  title: string;
  shortTitle: string;
  emoji: string;
  description: string;
  color: string;
  badgeColor: string;
}

export interface BaseQuestion {
  id: string;
  topicId: TopicId;
  instruction: string;
  audioText: string;
  hint?: string;
}

// Dictado
export interface DictadoQuestion extends BaseQuestion {
  topicId: 'dictado';
  targetNumber: number;
  numberInWords: string;
}

// Patrones
export interface PatronesQuestion extends BaseQuestion {
  topicId: 'patrones';
  patternType: 'numbers' | 'shapes';
  sequence: (number | string | null)[];
  correctAnswer: number | string;
  options: (number | string)[];
  explanation: string;
}

// Unidades y Decenas
export interface UnidadesDecenasQuestion extends BaseQuestion {
  topicId: 'unidades-decenas';
  mode: 'identify' | 'build';
  tens: number;
  units: number;
  targetNumber: number;
  questionText: string;
}

// Conteo
export interface ConteoQuestion extends BaseQuestion {
  topicId: 'conteo';
  itemType: 'manzana' | 'estrella' | 'cohete' | 'gatito' | 'lapiz' | 'pelota';
  count: number;
  options: number[];
  prompt: string;
}

// Orden
export interface OrdenQuestion extends BaseQuestion {
  topicId: 'orden';
  orderType: 'asc' | 'desc' | 'compare';
  numbers: number[];
  correctOrder?: number[]; // for sorting
  comparisonSymbol?: '<' | '>' | '='; // for compare
  firstNumber?: number;
  secondNumber?: number;
}

// Problemas
export interface ProblemasQuestion extends BaseQuestion {
  topicId: 'problemas';
  storyText: string;
  dataNum1: number;
  dataNum2: number;
  operation: '+' | '-';
  result: number;
  itemEmoji: string;
  itemName: string;
  questionPrompt: string;
}

export type MathQuestion = 
  | DictadoQuestion 
  | PatronesQuestion 
  | UnidadesDecenasQuestion 
  | ConteoQuestion 
  | OrdenQuestion 
  | ProblemasQuestion;

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  requirement: string;
  unlocked: boolean;
  category: 'bronce' | 'plata' | 'oro' | 'especial';
}

export interface UserProgress {
  totalStars: number;
  completedExercises: number;
  topicStats: Record<TopicId, { completed: number; correct: number }>;
  stickersUnlocked: string[];
  lastExamScore?: {
    score: number;
    total: number;
    date: string;
    studentName: string;
  };
}
