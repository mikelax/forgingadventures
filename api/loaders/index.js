import DataLoader from 'dataloader';

import GameLabel from 'models/gameLabel';
import User from 'models/user';

export default function(options) {
  return {
    users: new DataLoader(ids => modelIdFetcher(User, ids), options),
    gameLabels: new DataLoader(ids => modelIdFetcher(GameLabel, ids), options)
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
