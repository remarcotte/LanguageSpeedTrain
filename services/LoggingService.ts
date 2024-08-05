// LoggingService.ts

import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persisting key-value pairs
import {
  GameRecord,
  GameSummary,
  GameDetail,
  LogDeckSummary,
  DeckDetail,
} from "@/types/LoggingTypes"; // Import necessary types
import { DeckDb, DeckSummary } from "@/types/DeckTypes"; // Import deck-related types
import { DBService } from "./DBService"; // Import database service
import { ErrorService } from "@/services/ErrorService"; // Import error service
import { ErrorActionType } from "@/types/ErrorTypes"; // Import error action types

export class LoggingService {
  private static instance: LoggingService; // Singleton instance of LoggingService

  dbService = DBService.getInstance(); // Instance of DBService for database operations
  errorService = ErrorService.getInstance(); // Instance of ErrorService for error handling

  // Singleton pattern implementation for LoggingService
  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  // Clear all logs and reset AsyncStorage keys
  async clearAll() {
    try {
      await this.dbService.execAsync(`
        DELETE FROM game_detail;
        DELETE FROM game_summary;
        DELETE FROM deck_summary;
        DELETE FROM deck_detail;`);

      // List of keys to be removed
      const keys = ["selectedDeck", "selectedCategory", "selectedDuration"];

      // Use multiRemove to delete all specified keys
      await AsyncStorage.multiRemove(keys);

      await this.errorService.logError(
        ErrorActionType.LOG,
        15,
        "Decks and storage reset.",
      );
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        16,
        "Failed to clear all decks and storage.",
        error,
      );
    }
  }

  // Clear logs for a specific deck
  async clearDeck(deckName: string) {
    try {
      await this.dbService.runAsync(
        "DELETE FROM game_detail WHERE gameId IN (SELECT id FROM game_summary WHERE deckName = ?);",
        [deckName],
      );
      await this.dbService.runAsync(
        "DELETE FROM game_summary WHERE deckName = ?;",
        [deckName],
      );
      await this.dbService.runAsync(
        "DELETE FROM deck_summary WHERE deckName = ?;",
        [deckName],
      );
      await this.dbService.runAsync(
        "DELETE FROM deck_detail WHERE deckName = ?;",
        [deckName],
      );
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        17,
        `Failed to clear logs and deck ${deckName}.`,
        error,
      );
    }
  }

  // Retrieve game log details and summary by gameId
  async showGameLog(
    gameId: number,
  ): Promise<{ summary: GameSummary; details: GameDetail[] } | null> {
    let summary: GameSummary | null = null;
    const details: GameDetail[] = [];

    try {
      const summaryResult = await this.dbService.getAllAsync<GameSummary>(
        "SELECT * FROM game_summary WHERE id = ?;",
        [gameId],
      );
      if (summaryResult && summaryResult.length > 0) {
        const item = summaryResult[0];
        summary = {
          ...item,
          datetime: this.dbService.dbDateToString(item.datetimeEnded),
        };
      }

      const detailsResult = await this.dbService.getAllAsync<GameDetail>(
        "SELECT * FROM game_detail WHERE gameId = ? ORDER BY id;",
        [gameId],
      );
      if (detailsResult) {
        detailsResult.forEach((detail) => {
          details.push(detail);
        });
      }
      return summary ? { summary, details } : null;
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        18,
        `Failed to retrieve gameLog for gameId ${gameId}.`,
        error,
      );
      return null;
    }
  }

  // Retrieve all game summaries
  async showGamesLog(): Promise<GameSummary[]> {
    let summaries: GameSummary[] = [];

    try {
      const result = await this.dbService.getAllAsync<GameSummary>(
        "SELECT * FROM game_summary ORDER BY id DESC LIMIT 200;",
        [],
      );
      if (result) {
        summaries = result.map((item: any) => ({
          ...item,
          datetime: this.dbService.dbDateToString(item.datetimeEnded),
        }));
      }
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        19,
        "Failed to retrieve game logs.",
        error,
      );
    }
    return summaries;
  }

  // Retrieve a summary, games, and details for a specific deck
  async getDeckSummary(deckName: string): Promise<{
    summary: LogDeckSummary;
    games: GameSummary[];
    details: DeckDetail[];
  } | null> {
    let summary: LogDeckSummary | null = null;
    let games: GameSummary[] = [];
    let details: DeckDetail[] = [];

    try {
      const summaryResult = await this.dbService.getAllAsync<LogDeckSummary>(
        "SELECT * FROM deck_summary WHERE deckName = ?;",
        [deckName],
      );
      if (summaryResult && summaryResult.length > 0) {
        summary = summaryResult[0];
      }

      const gameSummaries = await this.dbService.getAllAsync<GameSummary>(
        "SELECT * FROM game_summary where deckName = ? ORDER BY id DESC LIMIT 200;",
        [deckName],
      );
      if (gameSummaries) {
        games = gameSummaries.map((item: any) => ({
          ...item,
          datetime: this.dbService.dbDateToString(item.datetimeEnded),
        }));
      }

      const detailsResult = await this.dbService.getAllAsync<DeckDetail>(
        "SELECT * FROM deck_detail WHERE deckName = ? order by numberAttempts desc, numberCorrect desc;",
        [deckName],
      );
      if (detailsResult) {
        detailsResult.forEach((detail) => {
          details.push(detail);
        });
      }

      return summary ? { summary, games, details } : null;
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        20,
        `Failed to retrieve deck summary for ${deckName}.`,
        error,
      );
      return null;
    }
  }

  // Log a game record
  async logGame(gameRecord: GameRecord) {
    const correct = gameRecord.turns.filter((turn) => turn.isCorrect).length;
    const attempted = gameRecord.turns.length;
    const correctAttempted = parseFloat(
      ((correct / attempted) * 100).toFixed(2),
    );
    const durationInMinutes = gameRecord.duration / 60;
    const correctPerMinute = parseFloat(
      (correct / durationInMinutes).toFixed(2),
    );

    try {
      const result = await this.dbService.runAsync(
        "INSERT INTO game_summary (deckName, category, duration, attempted, correct) VALUES (?, ?, ?, ?, ?);",
        [
          gameRecord.deckName,
          gameRecord.category,
          gameRecord.duration,
          attempted,
          correct,
        ],
      );
      const gameId = result?.lastInsertRowId ? result.lastInsertRowId : 0;

      for (const turn of gameRecord.turns) {
        await this.dbService.runAsync(
          "INSERT INTO game_detail (gameId, text, type, category, response, isCorrect) VALUES (?, ?, ?, ?, ?, ?);",
          [
            gameId,
            turn.text,
            turn.type,
            turn.category,
            turn.response,
            turn.isCorrect ? 1 : 0,
          ],
        );
      }

      // Insert new row into deck_summary if doesn't exist
      await this.dbService.runAsync(
        `INSERT OR IGNORE INTO deck_summary (deckName, timesPlayed, minCorrect, maxCorrect, minCorrectPerAttempt, maxCorrectPerAttempt, minCorrectPerMinute, maxCorrectPerMinute)
         VALUES (?, 0, ?, ?, ?, ?, ?, ?);`,
        [
          gameRecord.deckName,
          correct,
          correct,
          correctAttempted,
          correctAttempted,
          correctPerMinute,
          correctPerMinute,
        ],
      );

      // Update deck summary setting min/max vaues if conditions are met
      await this.dbService.runAsync(
        `UPDATE deck_summary SET
         timesPlayed = timesPlayed + 1,
         minCorrect = CASE WHEN minCorrect > ? THEN ? ELSE minCorrect END,
         maxCorrect = CASE WHEN maxCorrect < ? THEN ? ELSE maxCorrect END,
         minCorrectPerAttempt = CASE WHEN minCorrectPerAttempt > ? THEN ? ELSE minCorrectPerAttempt END,
         maxCorrectPerAttempt = CASE WHEN maxCorrectPerAttempt < ? THEN ? ELSE maxCorrectPerAttempt END,
         minCorrectPerMinute = CASE WHEN minCorrectPerMinute > ? THEN ? ELSE minCorrectPerMinute END,
         maxCorrectPerMinute = CASE WHEN maxCorrectPerMinute < ? THEN ? ELSE maxCorrectPerMinute END
         WHERE deckName = ?;`,
        [
          correct,
          correct,
          correct,
          correct,
          correctAttempted,
          correctAttempted,
          correctAttempted,
          correctAttempted,
          correctPerMinute,
          correctPerMinute,
          correctPerMinute,
          correctPerMinute,
          gameRecord.deckName,
        ],
      );

      // Insert new row into deck_detail if doesn't exist
      await this.dbService.runAsync(
        `INSERT OR IGNORE INTO deck_detail (deckName, text, numberAttempts, numberCorrect)
         SELECT ?, text, 0, 0 FROM game_detail WHERE gameId IN (SELECT id FROM game_summary WHERE deckName = ?) GROUP BY text;`,
        [gameRecord.deckName, gameRecord.deckName],
      );

      for (const turn of gameRecord.turns) {
        await this.dbService.runAsync(
          `UPDATE deck_detail SET
           numberAttempts = numberAttempts + 1,
           numberCorrect = numberCorrect + ?
           WHERE ? != 'skip' and deckName = ? AND text = ?;`,
          [turn.isCorrect ? 1 : 0, turn.type, gameRecord.deckName, turn.text],
        );
      }

      await this.dbService.runAsync(
        `DELETE FROM game_detail WHERE gameId NOT IN (SELECT id FROM game_summary ORDER BY id DESC LIMIT 200);`,
      );
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        21,
        "Failed to log game.",
        error,
      );
    }
  }

  // Retrieve debugging information from various tables
  async getDebug() {
    try {
      const deck = await this.dbService.getFirstAsync<DeckDb>(
        `select * from deck limit 1;`,
      );
      const game_summary = await this.dbService.getFirstAsync<GameSummary>(
        `select * from game_summary order by id desc limit 1;`,
      );
      const game_detail = await this.dbService.getFirstAsync<GameDetail>(
        `select * from game_detail order by id desc limit 1;`,
      );
      const deck_summary = await this.dbService.getFirstAsync<DeckSummary>(
        `select * from deck_summary limit 1;`,
      );
      const deck_detail = await this.dbService.getFirstAsync<DeckDetail>(
        `select * from deck_detail order by id desc limit 1;`,
      );
      return { deck, game_summary, game_detail, deck_summary, deck_detail };
    } catch (error) {
      await this.errorService.logError(
        ErrorActionType.CONSOLE,
        22,
        "Failed to get debug data.",
        error,
      );
    }
  }
}
