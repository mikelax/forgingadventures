import { compose, Model } from 'objection';

import setUpdatedAt from 'models/plugins/setUpdatedAt';

const mixins = compose(setUpdatedAt);

export default class GamePlayer extends mixins(Model) {
  static tableName = 'game_players';

  static modelPaths = [__dirname];

  static relationMappings = {
    relation: Model.BelongsToOneRelation,
    modelClass: 'User',
    join: {
      from: 'game_players.userId',
      to: 'users.id'
    }
  }
}
