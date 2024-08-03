import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GameRecord,
  GameSummary,
  GameDetail,
  LogDeckSummary,
  DeckDetail,
} from "../types/LoggingTypes";
import DBService from "./DBService";

class LoggingService {
  private static instance: LoggingService;

  dbService = DBService.getInstance();

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  async clearAll() {
    try {
      await this.dbService.execAsync(`
        DELETE FROM game_detail;
        DELETE FROM game_summary;
        DELETE FROM deck_summary;
        DELETE FROM deck_detail;`);
      await AsyncStorage.removeItem("selectedDeck");
      await AsyncStorage.removeItem("selectedCategory");
      await AsyncStorage.removeItem("selectedDuration");
    } catch (error) {
      console.error("Failed to clear all logs and storage", error);
    }
  }

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
      console.error(`Failed to clear logs for deck ${deckName}`, error);
    }
  }

  async showGameLog(
    gameId: number,
  ): Promise<{ summary: GameSummary; details: GameDetail[] } | null> {
    let summary: GameSummary | null = null;
    const details: GameDetail[] = [];

    try {
      const summaryResult = (await this.dbService.getAllAsync(
        "SELECT * FROM game_summary WHERE id = ?;",
        [gameId],
      )) as GameSummary[];
      if (summaryResult.length > 0) {
        const item = summaryResult[0] as GameSummary; // Explicit type assertion
        summary = {
          ...item,
          datetime: new Date(item.datetimeEnded * 1000)
            .toLocaleString()
            .replace(",", ""),
        };
      }

      const detailsResult = (await this.dbService.getAllAsync(
        "SELECT * FROM game_detail WHERE gameId = ? ORDER BY id;",
        [gameId],
      )) as GameDetail[];
      detailsResult.forEach((detail) => {
        details.push(detail as GameDetail); // Explicit type assertion
      });

      return summary ? { summary, details } : null;
    } catch (error) {
      console.error(`Failed to retrieve game log for gameId ${gameId}`, error);
      return null;
    }
  }

  async showGamesLog(): Promise<GameSummary[]> {
    let summaries: GameSummary[] = [];

    try {
      const result = (await this.dbService.getAllAsync(
        "SELECT * FROM game_summary ORDER BY id DESC LIMIT 200;",
        [],
      )) as GameSummary[];
      summaries = result.map((item: any) => ({
        ...item,
        datetime: new Date(item.datetimeEnded * 1000)
          .toLocaleString()
          .replace(",", ""),
      }));

      return summaries;
    } catch (error) {
      console.error("Failed to retrieve game logs", error);
      return summaries;
    }
  }

  async getDeckSummary(deckName: string): Promise<{
    summary: LogDeckSummary;
    games: GameSummary[];
    details: DeckDetail[];
  } | null> {
    let summary: LogDeckSummary | null = null;
    let games: GameSummary[] | null = null;
    let details: DeckDetail[] = [];

    try {
      const summaryResult = (await this.dbService.getAllAsync(
        "SELECT * FROM deck_summary WHERE deckName = ?;",
        [deckName],
      )) as LogDeckSummary[];
      if (summaryResult.length > 0) {
        summary = summaryResult[0] as LogDeckSummary; // Explicit type assertion
      }

      const gameSummaries = (await this.dbService.getAllAsync(
        "SELECT * FROM game_summary where deckName = ? ORDER BY id DESC LIMIT 200;",
        [deckName],
      )) as GameSummary[];
      games = gameSummaries
        ? gameSummaries.map((item: any) => ({
            ...item,
            datetime: new Date(item.datetimeEnded * 1000)
              .toLocaleString()
              .replace(",", ""),
          }))
        : [];

      const detailsResult = (await this.dbService.getAllAsync(
        "SELECT * FROM deck_detail WHERE deckName = ? order by numberAttempts desc, numberCorrect desc;",
        [deckName],
      )) as DeckDetail[];
      detailsResult.forEach((detail) => {
        details.push(detail as DeckDetail); // Explicit type assertion
      });

      return summary ? { summary, games, details } : null;
    } catch (error) {
      console.error(
        `Failed to retrieve deck summary for deck ${deckName}`,
        error,
      );
      return null;
    }
  }

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

      // Update deck summary
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
      console.error("Failed to log game", error);
    }
  }

  async getDebug() {
    try {
      const deck = await this.dbService.getFirstAsync(
        `select * from deck limit 1;`,
      );
      const game_summary = await this.dbService.getFirstAsync(
        `select * from game_summary order by id desc limit 1;`,
      );
      const game_detail = await this.dbService.getFirstAsync(
        `select * from game_detail order by id desc limit 1;`,
      );
      const deck_summary = await this.dbService.getFirstAsync(
        `select * from deck_summary limit 1;`,
      );
      const deck_detail = await this.dbService.getFirstAsync(
        `select * from deck_detail order by id desc limit 1;`,
      );
      return { deck, game_summary, game_detail, deck_summary, deck_detail };
    } catch (error) {
      console.error("Failed to get debug data", error);
    }
  }
}

export default LoggingService;
