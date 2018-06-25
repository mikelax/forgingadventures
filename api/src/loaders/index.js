import DataLoader from 'dataloader';

import Character from 'models/character';
import CharacterLog from 'models/characterLog';
import Game from 'models/game';
import GameLabel from 'models/gameLabel';
import GamePlayer from 'models/gamePlayer';
import User from 'models/user';

export default function(options) {
  return {
    characterLogs: new DataLoader(ids => modelIdFetcher(CharacterLog, ids), options),
    characters: new DataLoader(ids => modelIdFetcher(Character, ids), options),
    games: new DataLoader(ids => modelIdFetcher(Game, ids), options),
    gameLabels: new DataLoader(ids => modelIdFetcher(GameLabel, ids), options),
    gamePlayers: new DataLoader(ids => modelIdFetcher(GamePlayer, ids), options),
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
