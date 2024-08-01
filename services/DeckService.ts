import hiriganaDeck from '../assets/decks/hirigana.json';
import katakanaDeck from '../assets/decks/katakana.json';
import nlpt5Deck from '../assets/decks/nlpt5.json';
import nlpt5KanjiDeck from '../assets/decks/nlpt5-kanji.json';
import { Deck, DeckSummary, DeckDb } from '../types/DeckTypes';
import DBService from './DBService';

type Cntr = {
  cnt: number;
};

class DeckService {
  private static instance: DeckService;
  dbService = DBService.getInstance();

  public static getInstance(): DeckService {
    if (!DeckService.instance) {
      DeckService.instance = new DeckService();
    }
    return DeckService.instance;
  }

  public async initDecks(): Promise<void> {
    try {
      const count = await this.getDecksCount();
      if (count === 0) {
        await this.initializeDefaultDecks();
      }
    } catch (error) {
      console.error('Error initializing decks: ', error);
    }
  }

  private async getDecksCount(): Promise<number> {
    let count = 0;

    try {
      const item = (await this.dbService.getFirstAsync(
        'SELECT count(*) cnt from deck',
      )) as Cntr;
      if (item) {
        count = item.cnt;
      }
    } catch (error) {
      console.error('Error getting decks count: ', error);
    }
    return count;
  }

  public async checkDeckExists(deckName: string): Promise<number> {
    let count: number = 0;

    try {
      const item = (await this.dbService.getFirstAsync(
        'SELECT count(*) cnt from deck where deckName = ?',
        [deckName],
      )) as Cntr;
      if (item) {
        count = item.cnt;
      }
    } catch (error) {
      console.error('Error getting decks count: ', error);
    }
    return count;
  }

  private async initializeDefaultDecks(): Promise<void> {
    try {
      const defaultDecks = [
        hiriganaDeck,
        katakanaDeck,
        nlpt5Deck,
        nlpt5KanjiDeck,
      ];
      for (const deck of defaultDecks) {
        await this.addDeck(
          deck.name,
          deck.categories.join('|'),
          JSON.stringify(deck.items),
        );
      }
    } catch (error) {
      console.error('Error initializing default decks: ', error);
    }
  }

  public async getDeck(deckName: string): Promise<Deck | null> {
    let deck: Deck | null = null;

    try {
      const item = (await this.dbService.getFirstAsync(
        'SELECT * from deck where deckName = ?',
        [deckName],
      )) as DeckDb;
      if (!item) {
        console.error('Failed to get deck - not found');
        return null;
      }
      deck = {
        name: item.deckName,
        categories: item.categories.split('|'),
        items: JSON.parse(item.items),
      };
    } catch (error) {
      console.error(`Error getting deck: ${deckName}`, error);
    }
    return deck;
  }

  public async getDecksSummary(): Promise<DeckSummary[]> {
    const summaries: DeckSummary[] = [];
    try {
      const items = (await this.dbService.getAllAsync(
        'SELECT * from deck order by deckName',
      )) as DeckDb[];
      if (!items) {
        console.error('Failed to get decks - not found');
        return summaries;
      }

      for (const item of items) {
        const categories = item.categories.split('|');
        const count = JSON.parse(item.items).length;
        summaries.push({
          deckName: item.deckName,
          categories: categories,
          itemCount: count,
        });
      }
    } catch (error) {
      console.error(`Error getting deck summaries`, error);
    }
    return summaries;
  }

  public async newDeck(
    deckName: string,
    categories: string[],
    items: string[][],
  ): Promise<void> {
    try {
      await this.addDeck(deckName, categories.join('|'), JSON.stringify(items));
    } catch (error) {
      console.error('Error creating new deck: ', error);
    }
  }

  private async addDeck(
    deckName: string,
    categories: string,
    items: string,
  ): Promise<void> {
    try {
      await this.dbService.runAsync(
        'INSERT INTO deck (deckName, categories, items) VALUES (?, ?, ?);',
        [deckName, categories, items],
      );
    } catch (error) {
      console.error(`Failed to add deck ${deckName}`, error);
    }
  }

  private async updateDeck(
    deckName: string,
    categories: string,
    items: string,
  ): Promise<void> {
    try {
      await this.dbService.runAsync(
        'UPDATE deck SET categories = ?, items = ? where deckName = ?;',
        [categories, items, deckName],
      );
    } catch (error) {
      console.error(`Failed to update deck ${deckName}`, error);
    }
  }

  public async deleteDeck(deckName: string): Promise<void> {
    try {
      await this.dbService.runAsyncTx(
        `DELETE FROM deck where deckName = ?;
         DELETE FROM game_detail where gameId in
          (select id from game_summary where deckName = ?);
         DELETE FROM game_summary where deckName = ?;
         DELETE FROM deck_summary where deckName = ?;
         DELETE FROM deck_detail where deckName = ?;
         `,
        [deckName, deckName, deckName, deckName, deckName],
      );
    } catch (error) {
      console.error(`Failed to delete deck ${deckName}`, error);
    }
  }

  public async resetDecks(): Promise<void> {
    try {
      await this.dbService.resetAll();
      await this.initDecks();
    } catch (error) {
      console.error(`Failed to delete decks`, error);
    }
  }

  private sortItems(items: string[][]): string[][] {
    return items.sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }),
    );
  }

  public async addDeckItem(deckName: string, item: string[]): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const items = this.sortItems([...deck.items, item]);
        await this.updateDeck(
          deckName,
          deck.categories.join('|'),
          JSON.stringify(items),
        );
      }
    } catch (error) {
      console.error('Error adding deck item: ', error);
    }
  }

  public async deleteDeckItem(deckName: string, text: string): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const items = deck.items.filter((item) => item[0] !== text);
        await this.updateDeck(
          deckName,
          deck.categories.join('|'),
          JSON.stringify(items),
        );
      }
    } catch (error) {
      console.error('Error deleting deck item: ', error);
    }
  }

  public async updateDeckItem(
    deckName: string,
    text: string,
    item: string[],
  ): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const items = deck.items.map((i) => (i[0] === text ? item : i));
        await this.updateDeck(
          deckName,
          deck.categories.join('|'),
          JSON.stringify(this.sortItems(items)),
        );
      }
    } catch (error) {
      console.error('Error updating deck item: ', error);
    }
  }

  public async changeDeckName(oldName: string, newName: string): Promise<void> {
    try {
      await this.dbService.runAsyncTx(
        `UPDATE deck set deckName = ? where deckName = ?;
         UPDATE game_summary set deckName = ? where deckName = ?;
         UPDATE deck_summary set deckName = ? where deckName = ?;
         UPDATE deck_detail set deckName = ? where deckName = ?;`,
        [
          oldName,
          newName,
          oldName,
          newName,
          oldName,
          newName,
          oldName,
          newName,
        ],
      );
    } catch (error) {
      console.error(`Failed to change deck name ${oldName}/${newName}`, error);
    }
  }

  public async changeCategoryName(
    deckName: string,
    oldCategoryName: string,
    newCategoryName: string,
  ): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const categories = deck.categories.map((category) =>
          category === oldCategoryName ? newCategoryName : category,
        );

        const updateStatements = `
          UPDATE deck SET categories = ? WHERE deckName = ?;
          UPDATE game_summary set category = ? where deckName = ? and category = ?;
          UPDATE game_detail set category = ? where category_name = ?
            and gameId in (select id from game_summary where deckName = ?);`;
        await this.dbService.runAsyncTx(updateStatements, [
          categories.join('|'),
          deckName,
          newCategoryName,
          deckName,
          oldCategoryName,
          newCategoryName,
          oldCategoryName,
          deckName,
        ]);
      }
    } catch (error) {
      console.error('Error changing category name: ', error);
    }
  }

  async createDeck(deckName: string, csvData: string) {
    try {
      if (!deckName.trim()) {
        console.error('Deck name cannot be empty');
        return;
      }

      const lines = csvData
        .trim()
        .split('\n')
        .filter((line) => line.trim() !== '');
      if (lines.length < 2) {
        // Need at least one row of categories and one row of data
        console.error('CSV data is incomplete');
        return;
      }

      const headers = lines[0].split(',').map((header) => header.trim());
      if (headers[0] !== 'text') {
        console.error('The first column must be "text"');
        return;
      }

      const categories = headers.slice(1);

      const items = lines
        .slice(1)
        .map((line) => {
          const values = line.split(',').map((value) => value.trim());
          if (values.length !== headers.length) {
            console.error('Mismatch in the number of categories');
            return null;
          }
          return values;
        })
        .filter((item) => item !== null) as string[][];

      if (items.length === 0) {
        console.error('Deck must have at least one item');
        return;
      }

      await this.newDeck(deckName, categories, items);
    } catch (error) {
      console.error('Failed to create deck', error);
    }
  }
}

export default DeckService;
