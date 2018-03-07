import { compose, Model } from 'objection';

import GamePlayer from './gamePlayer';
import User from './user';
import setUpdatedAt from 'models/plugins/setUpdatedAt';

const mixins = compose(setUpdatedAt);

export default class Game extends mixins(Model) {
  static tableName = 'games';

  static relationMappings = {
    gamePlayers: {
      relation: Model.HasManyRelation,
      modelClass: GamePlayer,
      join: {
        from: 'games.id',
        to: 'game_players.gameId'
      }
    },
    players: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'games.id',
        through: {
          from: 'game_players.gameId',
          to: 'game_players.userId'
        },
        to: 'users.id'
      }
    }
  }
}
