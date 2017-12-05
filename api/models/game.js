import { Model } from 'objection';

import GameMessage from 'models/gameMessage';

export default class Game extends Model {
  static tableName = 'games';
}
