import { DeckService } from "./DeckService"; // Import the DeckService for managing deck operations
import { DBService } from "./DBService"; // Import the DBService for managing database operations

// The InitAll class handles the initialization of database and deck services
export class InitAll {
  dbService = DBService.getInstance(); // Singleton instance of DBService
  deckService = DeckService.getInstance(); // Singleton instance of DeckService

  // Initialize the database and decks
  async initialize() {
    // Initialize the database schema and tables
    await this.dbService.initDB();

    // Initialize default decks if they do not exist
    await this.deckService.initDecks();
  }
}
