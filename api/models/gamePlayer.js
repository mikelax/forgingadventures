import { compose, Model } from 'objection';

import setUpdatedAt from 'models/plugins/setUpdatedAt';

const mixins = compose(setUpdatedAt);

export default class GamePlayer extends mixins(Model) {
  static tableName = 'game_players';
}
