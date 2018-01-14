import { combineReducers } from 'redux';
import authorisation from './auth';
import gamesSearch from './gamesSearch';

export default combineReducers({
  authorisation,
  gamesSearch
});
