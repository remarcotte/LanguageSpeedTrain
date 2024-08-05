// A deck consists of a name, a number of categories and an array of items
// consisting of values for the text (items[0][]) and the categories (everything
// else in items).
export type Deck = {
  name: string;
  categories: string[];
  items: string[][];
};

// Database representation of Deck type.
// Categories and items are serialized/deserialized when moving between the types.
export type DeckDb = {
  deckName: string;
  categories: string;
  items: string;
};

// After retrieving decks, deck summaries are created for list visualization
export type DeckSummary = {
  deckName: string;
  categories: string[];
  itemCount: number;
};

