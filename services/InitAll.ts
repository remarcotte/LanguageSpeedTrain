import DeckService from './DeckService';
import DBService from './DBService';

class InitAll {
  dbService = DBService.getInstance();
  deckService = DeckService.getInstance();

  async initialize() {
    await this.dbService.initDB();
    await this.deckService.initDecks();
  }
}

export default InitAll;
