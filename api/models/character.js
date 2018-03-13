import { compose, Model } from 'objection';

import setUpdatedAt from './plugins/setUpdatedAt';

const mixins = compose(setUpdatedAt);

export default class Character extends mixins(Model) {
  static tableName = 'characters';
}
