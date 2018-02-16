import { combineReducers } from 'redux';

import authorisation from './auth';
import gamesSearch from './gamesSearch';
import gameMessage from './gameMessage';
import loungeMessage from './loungeMessage';
import me from './me';

export default combineReducers({
  authorisation, // fixme authorisation -> authorization
  gamesSearch,
  gameMessage,
  loungeMessage,
  me
});
