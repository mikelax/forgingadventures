import { SEARCH, RESET_SEARCH } from '../actions/gamesSearch';

const defaultState = {
  textSearch: '',
  labelId: '0',
  gameSettings: {}
};

export default function gameSearchReducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        ...action.searchParams
      };
    case RESET_SEARCH:
      return defaultState;
    default:
      return state;
  }
}
