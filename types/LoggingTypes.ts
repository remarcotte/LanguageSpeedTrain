// src/types/LoggingTypes.ts

export type GameSummary = {
  id: number;
  datetimeEnded: number;
  datetime?: string;
  deck: string;
  category: string;
  duration: number;
  attempted: number;
  correct: number;
};

export type GameDetail = {
  text: string;
  type: string;
  category: string;
  response: string;
  isCorrect: boolean;
};

export type LogDeckSummary = {
  deck: string;
  timesPlayed: number;
  minCorrect: number;
  maxCorrect: number;
  minCorrectPerAttempt: number;
  maxCorrectPerAttempt: number;
  minCorrectPerMinute: number;
  maxCorrectPerMinute: number;
};

export type DeckDetail = {
  deck: string;
  text: string;
  numberAttempts: number;
  numberCorrect: number;
};

export type Turn = {
  text: string;
  type: string;
  category: string;
  response: string;
  isCorrect: boolean;
};

export type TurnAnswer = {
  text: string;
  type: string;
  category: string;
  response: string;
  isCorrect: boolean;
  answer?: string;
};

export type GameRecord = {
  deckName: string;
  category: string;
  duration: number;
  turns: Turn[];
};
