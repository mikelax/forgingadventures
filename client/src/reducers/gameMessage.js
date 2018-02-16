import { QUOTE } from '../actions/gameMessage';

export default function gameMessageReducer(state = {}, action) {

  switch (action.type) {
    case QUOTE:
      return {
        ...state,
        message: action.message
      };
    default:
      return state;
  }
}
