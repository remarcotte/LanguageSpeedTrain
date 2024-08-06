// Schema.js

// errors or extremely significan events are logged to errors.
// This table should be small. It will remain small as errors are
// pruned to keep only the last N (initially 200) when new errors
// are logged.
//
// Some notes on columns:
// errorId: application supplied id. Uniquely numbered by log call
// if error object generated for the log, contains start of error.message
// contains an application context error message
export const CREATETABLEERRORS = `
      CREATE TABLE IF NOT EXISTS errors (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          errorId INTEGER,
          logDatetime INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          error TEXT NOT NULL,
          message TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS errors_k1 ON errors (logDatetime DESC);`;

// The decks loaded for game play
export const CREATETABLEDECK = `
      CREATE TABLE IF NOT EXISTS deck (
          deckName TEXT NOT NULL PRIMARY KEY,
          categories TEXT NOT NULL,
          items TEXT NOT NULL
        );`;

// A summary of metrics each game played
export const CREATETABLEGAMESUMMARY = `
      CREATE TABLE IF NOT EXISTS game_summary (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          datetimeEnded INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          deckName TEXT NOT NULL,
          category TEXT NOT NULL,
          duration INTEGER NOT NULL,
          attempted INTEGER NOT NULL,
          correct INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS game_summary_k1 ON game_summary (deckname, datetimeEnded DESC);`;

// Details for each game played. This table could grow large so it is
// pruned to keep only details for the last N games (initially 200).
export const CREATETABLEGAMEDETAIL = `
      CREATE TABLE IF NOT EXISTS game_detail (
          id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          gameId INTEGER NOT NULL,
          type TEXT NOT NULL,
          text TEXT NOT NULL,
          category TEXT NOT NULL,
          response TEXT NOT NULL,
          isCorrect TINYINT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS game_detail_k1 ON game_detail (gameId, id);`;

// Statistics at deck level rolled up across all games played
export const CREATETABLEDECKSUMMARY = `
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

// Statistics at deck item level rolled up across all games played
export const CREATETABLEDECKDETAIL = `
      CREATE TABLE IF NOT EXISTS deck_detail (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          deckName TEXT NOT NULL,
          text TEXT NOT NULL,
          numberAttempts INTEGER NOT NULL,
          numberCorrect INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS deck_detail_k1 ON deck_detail (deckName);`;

export const DROPTABLEERRORS = `
        DROP TABLE IF EXISTS errors;`;
export const DROPTABLEDECK = `
        DROP TABLE IF EXISTS deck;`;
export const DROPTABLEGAMESUMMARY = `
        DROP TABLE IF EXISTS game_summary;`;
export const DROPTABLEGAMEDETAIL = `
        DROP TABLE IF EXISTS game_detail;`;
export const DROPTABLEDECKSUMMARY = `
        DROP TABLE IF EXISTS deck_summary;`;
export const DROPTABLEDECKDETAIL = `
        DROP TABLE IF EXISTS deck_detail;`;
