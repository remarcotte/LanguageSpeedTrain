// DeckService.ts

import hiriganaDeck from "../assets/decks/hirigana.json"; // Import default decks
import katakanaDeck from "../assets/decks/katakana.json";
import nlpt5Deck from "../assets/decks/nlpt5.json";
import nlpt5KanjiDeck from "../assets/decks/nlpt5-kanji.json";

import { Deck, DeckSummary, DeckDb } from "../types/DeckTypes"; // Import types

import { DBService } from "./DBService"; // Import database service
import { ErrorService } from "@/services/ErrorService"; // Import error service
import { ErrorActionType } from "@/types/ErrorTypes"; // Import error action types

type Cntr = {
  cnt: number; // Type definition for count results
};

export class DeckService {
  private static instance: DeckService; // Singleton instance of DeckService
  dbService = DBService.getInstance(); // Database service instance
  errorService = ErrorService.getInstance(); // Error service instance

  // Singleton pattern implementation for DeckService
  public static getInstance(): DeckService {
    if (!DeckService.instance) {
      DeckService.instance = new DeckService();
    }
    return DeckService.instance;
  }

  // Initialize decks, loading defaults if no decks are present
  public async initDecks(): Promise<void> {
    try {
      const count = await this.getDecksCount(); // Get current deck count
      if (count === 0) {
        await this.initializeDefaultDecks(); // Initialize default decks if count is zero
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        32,
        "Error initializing decks.",
        error,
      );
    }
  }

  // Get the number of decks in the database
  private async getDecksCount(): Promise<number> {
    let count = 0;

    try {
      const item = await this.dbService.getFirstAsync<Cntr>(
        "SELECT count(*) cnt from deck", // SQL query to count decks
      );
      if (item) {
        count = item.cnt;
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        32,
        "Error getting decks count.",
        error,
      );
    }
    return count;
  }

  // Check if a deck exists by name
  public async checkDeckExists(deckName: string): Promise<number> {
    let count: number = 0;

    try {
      const item = await this.dbService.getFirstAsync<Cntr>(
        "SELECT count(*) cnt from deck where deckName = ?",
        [deckName], // Use prepared statement to avoid SQL injection
      );
      if (item) {
        count = item.cnt;
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        33,
        `Error getting deck ${deckName} count: `,
        error,
      );
    }
    return count;
  }

  // Initialize the default decks into the database
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
          deck.categories.join("|"),
          JSON.stringify(deck.items),
        );
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        34,
        "Error initializing default decks",
        error,
      );
    }
  }

  // Retrieve a specific deck by name
  public async getDeck(deckName: string): Promise<Deck | null> {
    let deck: Deck | null = null;

    try {
      const item = await this.dbService.getFirstAsync<DeckDb>(
        "SELECT * from deck where deckName = ?",
        [deckName], // Use prepared statement
      );
      if (!item) {
        await this.errorService.logError(
          ErrorActionType.CONSOLE,
          35,
          `Deck ${deckName} not found.`,
        );
        return null;
      }
      // Convert database item to Deck type
      deck = {
        name: item.deckName,
        categories: item.categories.split("|"),
        items: JSON.parse(item.items),
      };
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        36,
        `Error getting deck: ${deckName}.`,
        error,
      );
    }
    return deck;
  }

  // Retrieve summaries of all decks
  public async getDecksSummary(): Promise<DeckSummary[]> {
    const summaries: DeckSummary[] = [];
    try {
      const items = await this.dbService.getAllAsync<DeckDb>(
        "SELECT * from deck order by deckName",
      );
      if (!items) {
        await this.errorService.logError(
          ErrorActionType.CONSOLE,
          37,
          "Failed to get decks - not found.",
        );
        return summaries;
      }

      for (const item of items) {
        const categories = item.categories.split("|");
        const count = JSON.parse(item.items).length;
        // Create a summary for each deck
        summaries.push({
          deckName: item.deckName,
          categories: categories,
          itemCount: count,
        });
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        38,
        "Error getting deck summaries.",
      );
    }
    return summaries;
  }

  // Add a new deck to the database
  public async newDeck(
    deckName: string,
    categories: string[],
    items: string[][],
  ): Promise<void> {
    try {
      await this.addDeck(deckName, categories.join("|"), JSON.stringify(items));
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        39,
        "Error creating new deck.",
      );
    }
  }

  // Add a deck to the database
  private async addDeck(
    deckName: string,
    categories: string,
    items: string,
  ): Promise<void> {
    try {
      await this.dbService.runAsync(
        "INSERT INTO deck (deckName, categories, items) VALUES (?, ?, ?);",
        [deckName, categories, items],
      );

      await this.dbService.runAsync(
        `INSERT INTO deck_summary (
          deckName, timesPlayed, minCorrect, maxCorrect, minCorrectPerAttempt,
          maxCorrectPerAttempt, minCorrectPerMinute, maxCorrectPerMinute)
          VALUES (?, 0, 0, 0, 0, 0, 0, 0);`,
        [deckName],
      );

      // Add items to deck_detail table
      await this.syncDeckDetail(deckName, items);

    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        40,
        `Failed to add deck ${deckName}.`,
        error,
      );
    }
  }

  private async syncDeckDetail(deckName: string, items: string) {
    try {
      const parsedItems = JSON.parse(items);

      // Step 1: Remove rows not in the given data
      // Extract texts from parsedItems
      const texts = parsedItems.map((item: string[]) => item[0]);

      // Generate placeholders for the texts in SQL
      const placeholders = texts.map(() => '?').join(',');

      // Remove any row where deckName & text combination is not in the given data
      await this.dbService.runAsync(
        `DELETE FROM deck_detail
         WHERE deckName = ?
         AND text NOT IN (${placeholders});`,
        [deckName, ...texts]
      );

      // Step 2: Add new rows for any combo not in deck_detail
      for (const text of texts) {
        // Check if the combination already exists
        const existingEntry = await this.dbService.getFirstAsync(
          `SELECT id FROM deck_detail
           WHERE deckName = ? AND text = ?;`,
          [deckName, text]
        );

        // If it does not exist, insert a new row
        if (!existingEntry) {
          await this.dbService.runAsync(
            `INSERT INTO deck_detail (deckName, text, numberAttempts, numberCorrect)
             VALUES (?, ?, 0, 0);`,
            [deckName, text]
          );
        }
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        58,
        `Synch deck_detail error: ${deckName}.`,
        error,
      );
    }
  }

  // Update a deck in the database
  private async updateDeck(
    deckName: string,
    categories: string,
    items: string,
  ): Promise<void> {
    try {
      await this.dbService.runAsync(
        "UPDATE deck SET categories = ?, items = ? where deckName = ?;",
        [categories, items, deckName],
      );

      // Synch items to deck_detail table
      await this.syncDeckDetail(deckName, items);
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        41,
        `Failed to update deck ${deckName}.`,
        error,
      );
    }
  }

  // Delete a deck from the database
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
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        42,
        `Failed to delete deck ${deckName}.`,
        error,
      );
    }
  }

  // Reset all decks in the database
  public async resetDecks(): Promise<void> {
    try {
      await this.dbService.resetAll();
      await this.initDecks();
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        43,
        "Failed to reset decks.",
        error,
      );
    }
  }

  // Sort items in a deck
  private sortItems(items: string[][]): string[][] {
    return items.sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { sensitivity: "base" }),
    );
  }

  // Add an item to a deck
  public async addDeckItem(deckName: string, item: string[]): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const items = this.sortItems([...deck.items, item]);

        await this.updateDeck(
          deckName,
          deck.categories.join("|"),
          JSON.stringify(items)
        );

        // Add new item to deck_detail
        await this.dbService.runAsync(
          `INSERT INTO deck_detail (deckName, text, numberAttempts, numberCorrect)
             VALUES (?, ?, 0, 0);`,
          [deckName, item[0]]);
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        44,
        "Error adding deck item.",
        error,
      );
    }
  }

  // Delete an item from a deck
  public async deleteDeckItem(deckName: string, text: string): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const items = deck.items.filter((item) => item[0] !== text);
        await this.updateDeck(
          deckName,
          deck.categories.join("|"),
          JSON.stringify(items),
        );

        // Add new item to deck_detail
        await this.dbService.runAsync(
          `delete from deck_detail where deckName = ? and text = ?;`,
          [deckName, text]);
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        45,
        "Error deleting deck item.",
        error,
      );
    }
  }

  // Update an item in a deck
  public async updateDeckItem(
    deckName: string,
    text: string,   // existing text (used to locate item to replace)
    item: string[], // new item
  ): Promise<void> {
    try {
      const deck = await this.getDeck(deckName);
      if (deck) {
        const items = deck.items.map((i) => (i[0] === text ? item : i));
        await this.updateDeck(
          deckName,
          deck.categories.join("|"),
          JSON.stringify(this.sortItems(items)),
        );

        // Add new item to deck_detail
        await this.dbService.runAsync(
          `update deck_detail set text = ? where deckName = ? and text = ?;`,
          [item[0], deckName, text]);
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        46,
        "Error updating deck item.",
        error,
      );
    }
  }

  // Change the name of a deck
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
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        47,
        "Error to change deck name.",
        error,
      );
    }
  }

  // Change the name of a category within a deck
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
          categories.join("|"),
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
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        48,
        "Error changing category name.",
        error,
      );
    }
  }

  // Create a new deck from CSV data
  async createDeck(deckName: string, csvData: string): Promise<string> {
    let msg = ''
    try {
      // Validate the deck name
      if (!deckName.trim()) {
        msg = 'Deck name cannot be empty.';
        await this.errorService.logError(
          ErrorActionType.CONSOLE,
          49,
          msg,
        );
        return msg;
      }

      const lines = csvData
        .trim()
        .split("\n")
        .filter((line) => line.trim() !== "");

      // Validate CSV data has at least two lines
      if (lines.length < 2) {
        msg = 'CSV data is incomplete.';
        await this.errorService.logError(
          ErrorActionType.CONSOLE,
          50,
          msg,
        );
        return msg;
      }

      // Process headers
      const headers = lines[0].split(",").map((header) => header.trim());

      // Validate the first column
      if (headers[0] !== "text") {
        msg = 'The first column must be text.';
        await this.errorService.logError(
          ErrorActionType.CONSOLE,
          51,
          msg,
        );
        return msg;
      }

      const categories = headers.slice(1);

      // Process items with early exit on error
      const items: string[][] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((value) => value.trim());

        // Validate the number of values matches the number of headers
        if (values.length !== headers.length) {
          msg = 'Mismatch in the number of categories';
          await this.errorService.logError(
            ErrorActionType.CONSOLE,
            52,
            msg,
          );
          return msg;
        }
        items.push(values);
      }

      // Validate there are items to process
      if (items.length === 0) {
        msg = 'Deck must have at least one item.';
        await this.errorService.logError(
          ErrorActionType.CONSOLE,
          53,
          msg,
        );
        return msg;
      }

      // Proceed with creating the new deck
      await this.newDeck(deckName, categories, items);
    } catch (error) {
      msg = 'Failed to create deck.';
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        54,
        msg,
        error,
      );
    }
    return msg;
  }
}
