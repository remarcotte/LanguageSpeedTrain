// DBService.ts

import * as SQLite from "expo-sqlite"; // Importing SQLite for database operations

import * as Schema from "@/constants/Schema.js"; // Importing database schema constants

// Singleton class for managing database operations
export class DBService {
  private static instance: DBService; // Singleton instance of DBService
  private db: SQLite.SQLiteDatabase; // SQLite database instance

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.db = SQLite.openDatabaseSync("logging.db"); // Open or create a SQLite database named "logging.db"
  }

  // Get the singleton instance of DBService
  public static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  // Run an asynchronous SQL query with parameters
  async runAsync(query: string, params: (string | number)[] = []) {
    if (!this.db) return; // Ensure database is initialized
    return this.db.runAsync(query, params);
  }

  // Run an asynchronous SQL query within a transaction
  async runAsyncTx(query: string, params: (string | number)[] = []) {
    if (!this.db) return; // Ensure database is initialized
    return await this.db.withTransactionAsync(async () => {
      this.db.runAsync(query, params);
    });
  }

  // Execute an asynchronous SQL query without expecting any results
  async execAsync(query: string) {
    if (!this.db) return; // Ensure database is initialized
    return await this.db.execAsync(query);
  }

  // Get the first result of an asynchronous SQL query
  async getFirstAsync<T>(query: string, params: (string | number)[] = []) {
    if (!this.db) return; // Ensure database is initialized
    return await this.db.getFirstAsync<T>(query, params);
  }

  // Get all results of an asynchronous SQL query
  async getAllAsync<T>(query: string, params: (string | number)[] = []) {
    if (!this.db) return; // Ensure database is initialized
    return await this.db.getAllAsync<T>(query, params);
  }

  // Reset all database tables
  async resetAll() {
    await this.execAsync(Schema.DROPTABLEERRORS); // Drop errors table
    await this.execAsync(Schema.DROPTABLEDECK); // Drop deck table
    await this.execAsync(Schema.DROPTABLEGAMESUMMARY); // Drop game summary table
    await this.execAsync(Schema.DROPTABLEGAMEDETAIL); // Drop game detail table
    await this.execAsync(Schema.DROPTABLEDECKSUMMARY); // Drop deck summary table
    await this.execAsync(Schema.DROPTABLEDECKDETAIL); // Drop deck detail table

    await this.initDB(); // Reinitialize the database schema
  }

  // Initialize the database with necessary tables
  async initDB() {
    await this.execAsync(Schema.CREATETABLEERRORS); // Create errors table
    await this.execAsync(Schema.CREATETABLEDECK); // Create deck table
    await this.execAsync(Schema.CREATETABLEGAMESUMMARY); // Create game summary table
    await this.execAsync(Schema.CREATETABLEGAMEDETAIL); // Create game detail table
    await this.execAsync(Schema.CREATETABLEDECKSUMMARY); // Create deck summary table
    await this.execAsync(Schema.CREATETABLEDECKDETAIL); // Create deck detail table

    // Verify table initialization by querying the deck table
    const c = (await this.getFirstAsync(
      "SELECT count(*) cnt from deck",
    )) as any;
  }

  // Convert a Unix timestamp to a readable string format
  dbDateToString(dateStr: number): string {
    return new Date(dateStr * 1000).toLocaleString().replace(",", "");
  }
}
