// Summary of a completed game: the options and basic statistics
export type GameSummary = {
  id: number;
  datetimeEnded: number;
  datetime?: string;  // for display. not persisted. populated after fetch from database
  deck: string;
  category: string;
  duration: number;
  attempted: number;
  correct: number;
};

// For each deck, we summarize basic statistics across all games
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

// For each item in a deck, we summarize basic statistics across all games
export type DeckDetail = {
  deck: string;
  text: string;
  numberAttempts: number;
  numberCorrect: number;
};

// Base type representing a turn in the game
export type Turn = {
  text: string;
  type: string;
  category: string;
  response: string;
  isCorrect: boolean;
};

// Game detail is useful for looking historically.
// As opposed to turn which is useful during/immediately after a game.
export type GameDetail = Turn;

// Turn with an optional answer
export interface TurnAnswer extends Turn {
  answer?: string; // Optional answer property
}

// Full record of a completed game - the options selected & the turns
export type GameRecord = {
  deckName: string;
  category: string;
  duration: number;
  turns: Turn[];
};
