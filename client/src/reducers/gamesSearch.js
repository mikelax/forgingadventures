import { SEARCH } from '../actions/gamesSearch';

export default function gameSearchReducer(state = {
  gameSettings: {}
}, action) {

  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        searchParams: action.searchParams
      };
    default:
      return state;
  }
}
