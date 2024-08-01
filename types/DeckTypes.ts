export type Deck = {
  name: string;
  categories: string[];
  items: string[][];
};

export type DeckSummary = {
  deckName: string;
  categories: string[];
  itemCount: number;
};

export type DeckDb = {
  deckName: string;
  categories: string;
  items: string;
};
