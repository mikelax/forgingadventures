import { combineReducers } from 'redux';

import authorisation from './auth';
import gamesSearch from './gamesSearch';
import me from './me';

export default combineReducers({
  authorisation, //fixme authorisation -> authorization
  gamesSearch,
  me
});
