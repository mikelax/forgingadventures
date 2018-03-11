import { compose, Model } from 'objection';

import setUpdatedAt from './plugins/setUpdatedAt';

const mixins = compose(setUpdatedAt);

export default class Character extends mixins(Model) {
  static tableName = 'characters';

  static modelPaths = [__dirname];

  static relationMappings = {
    gameLabels: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'GameLabel',
      join: {
        from: 'characters.labelId',
        to: 'game_labels.id'
      }
    },
    users: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'characters.userId',
        to: 'users.id'
      }
    }
  }
}
