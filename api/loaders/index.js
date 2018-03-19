import DataLoader from 'dataloader';

import Character from 'models/character';
import GameLabel from 'models/gameLabel';
import User from 'models/user';

export default function(options) {
  return {
    characters: new DataLoader(ids => modelIdFetcher(Character, ids), options),
    gameLabels: new DataLoader(ids => modelIdFetcher(GameLabel, ids), options),
    users: new DataLoader(ids => modelIdFetcher(User, ids), options)
  };
}

function modelIdFetcher(Model, ids) {
  return Model
    .query()
    .whereIn('id', ids)
    .then(rows => matchResultToQueryOrder(rows, ids));
}

function matchResultToQueryOrder(rows, ids) {
  return ids.map(id => rows.find(x => x.id === id));
}
