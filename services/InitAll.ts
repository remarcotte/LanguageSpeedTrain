import { DeckService } from "./DeckService";
import { DBService } from "./DBService";
import { LoggingService } from "./LoggingService";

export class InitAll {
  dbService = DBService.getInstance();
  deckService = DeckService.getInstance();

  async initialize() {
    await this.dbService.initDB();
    await this.deckService.initDecks();
  }
}
