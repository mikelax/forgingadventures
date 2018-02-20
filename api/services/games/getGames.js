import _ from 'lodash';
import Bluebird from 'bluebird';
import { raw } from 'objection';

import Game from 'models/game';

export default class {
  constructor(options) {
    this.perPage = 10;

    this.offset = options.offset || 0;
    this.searchOptions = options.searchOptions || {};
  }

  execute() {
    this.gameQuery = Game.query().limit(this.perPage).offset(this.offset);

    return Bluebird
      .bind(this)
      .then(doFullTextSearch)
      .then(doGameSettingsSearch)
      .then(doAssociationSearch)
      .then(() => this.gameQuery);
  }
}


// private

function doFullTextSearch() {
  const textSearch = _.get(this.searchOptions, 'textSearch');

  if (textSearch) {
    const textColumns = "to_tsvector(coalesce(title,'') || ' ' || coalesce(scenario, '') || ' ' || coalesce(overview, ''))"; // eslint-disable-line max-len

    this.gameQuery.where(raw(`${textColumns} @@ plainto_tsquery(?)`, textSearch));
  }
}

function doGameSettingsSearch() {
  const { gameSettings } = this.searchOptions;

  if (!(_.isEmpty(gameSettings))) {
    const { skillLevel, postingFrequency } = gameSettings;

    if (skillLevel) {
      this.gameQuery.whereJsonSupersetOf('gameSettings', { skillLevel });
    }
    if (postingFrequency) {
      this.gameQuery.whereJsonSupersetOf('gameSettings', { postingFrequency });
    }
  }
}

function doAssociationSearch() {
  const { labelId } = this.searchOptions;

  if (labelId) {
    this.gameQuery.where({ labelId });
  }
}
