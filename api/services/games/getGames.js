import _ from 'lodash';
import { raw } from 'objection';

import Game from 'models/game';

export default class {
  constructor(options) {
    this.perPage = 10;

    this.page = options.page || 0;
    this.searchOptions = options.searchOptions;
  }

  execute() {
    const gameQuery = Game.query().limit(this.perPage).offset(this.page);

    const textSearch = _.get(this.searchOptions, 'textSearch');

    if (textSearch) {
      gameQuery.where(raw('to_tsvector(??) @@ to_tsquery(?)', 'title', textSearch));
    }

    return gameQuery;
  }
}
