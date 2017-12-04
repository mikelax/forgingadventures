import { Model } from 'objection';

import GameMessage from 'models/gameMessage';

export default class Game extends Model {
  static tableName = 'games';

  static relationMappings = {
    messages: {
      relation: Model.HasManyRelation,
      modelClass: GameMessage,
      join: {
        from: 'Game.id',
        to: 'GameMessage.gameId'
      }
    }
  };

}
