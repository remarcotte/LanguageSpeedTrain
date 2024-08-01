import * as SQLite from 'expo-sqlite';

class DBService {
  private static instance: DBService;
  private db: SQLite.SQLiteDatabase;

  private constructor() {
    this.db = SQLite.openDatabaseSync('logging.db');
  }

  public static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  async runAsync(query: string, params: (string | number)[] = []) {
    if (!this.db) return;
    try {
      return this.db.runAsync(query, params);
    } catch (error) {
      console.error('SQL runAsync error', error);
    }
  }

  async runAsyncTx(query: string, params: (string | number)[] = []) {
    if (!this.db) return;
    try {
      return await this.db.withTransactionAsync(async () => {
        this.db.runAsync(query, params);
      });
    } catch (error) {
      console.error('SQL runAsync error', error);
    }
  }

  async execAsync(query: string) {
    if (!this.db) return;
    try {
      return await this.db.execAsync(query);
    } catch (error) {
      console.error('SQL runAsync error', error);
    }
  }

  async getFirstAsync<T>(query: string, params: (string | number)[] = []) {
    if (!this.db) return;
    try {
      return await this.db.getFirstAsync(query, params);
    } catch (error) {
      console.error('SQL getFirstAsync error', error);
    }
  }

  async getAllAsync<T>(query: string, params: (string | number)[] = []) {
    if (!this.db) return;
    try {
      return await this.db.getAllAsync(query, params);
    } catch (error) {
      console.error('SQL getAllAsync error', error);
    }
  }

  async resetAll() {
    const dropTableDeck = `
        DROP TABLE IF EXISTS deck;`;
    const dropTableGameSummary = `
        DROP TABLE IF EXISTS game_summary;`;
    const dropTableGameDetail = `
        DROP TABLE IF EXISTS game_detail;`;
    const dropTableDeckSummary = `
        DROP TABLE IF EXISTS deck_summary;`;
    const dropTableDeckDetail = `
        DROP TABLE IF EXISTS deck_detail;`;

    await this.execAsync(dropTableDeck);
    await this.execAsync(dropTableGameSummary);
    await this.execAsync(dropTableGameDetail);
    await this.execAsync(dropTableDeckSummary);
    await this.execAsync(dropTableDeckDetail);

    await this.initDB();
    // console.log('init complete');
  }

  async initDB() {
    try {
      const createTableDeck = `
      CREATE TABLE IF NOT EXISTS deck (
          deckName TEXT NOT NULL PRIMARY KEY,
          categories TEXT NOT NULL,
          items TEXT NOT NULL
        );`;
      const createTableGameSummary = `
      CREATE TABLE IF NOT EXISTS game_summary (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          datetimeEnded INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          deckName TEXT NOT NULL,
          category TEXT NOT NULL,
          duration INTEGER NOT NULL,
          attempted INTEGER NOT NULL,
          correct INTEGER NOT NULL
        );`;
      const createTableGameDetail = `
      CREATE TABLE IF NOT EXISTS game_detail (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          gameId INTEGER NOT NULL,
          type TEXT NOT NULL,
          text TEXT NOT NULL,
          category TEXT NOT NULL,
          response TEXT NOT NULL,
          isCorrect TINYINT NOT NULL
        );`;
      const createTableDeckSummary = `
      CREATE TABLE IF NOT EXISTS deck_summary (
          deckName TEXT PRIMARY KEY NOT NULL,
          timesPlayed INTEGER NOT NULL,
          minCorrect INTEGER NOT NULL,
          maxCorrect INTEGER NOT NULL,
          minCorrectPerAttempt REAL NOT NULL,
          maxCorrectPerAttempt REAL NOT NULL,
          minCorrectPerMinute REAL NOT NULL,
          maxCorrectPerMinute REAL NOT NULL
        );`;
      const createTableDeckDetail = `
      CREATE TABLE IF NOT EXISTS deck_detail (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          deckName TEXT NOT NULL,
          text TEXT NOT NULL,
          numberAttempts INTEGER NOT NULL,
          numberCorrect INTEGER NOT NULL
        );`;
      await this.execAsync(createTableDeck);
      await this.execAsync(createTableGameSummary);
      await this.execAsync(createTableGameDetail);
      await this.execAsync(createTableDeckSummary);
      await this.execAsync(createTableDeckDetail);

      const c = (await this.getFirstAsync(
        'SELECT count(*) cnt from deck',
      )) as any;

      // console.log('Initialization complete');
    } catch (error) {
      console.error('Failed to initialize database tables', error);
    }
  }
}

export default DBService;
