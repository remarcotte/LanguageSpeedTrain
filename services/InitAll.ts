import DeckService from './DeckService';
import DBService from './DBService';

class InitAll {
  dbService = DBService.getInstance();
  deckService = DeckService.getInstance();

  constructor() {
    this.init();
  }

  async init() {
    await this.dbService.initDB();
    await this.deckService.initDecks();
  }
}

export default InitAll;
