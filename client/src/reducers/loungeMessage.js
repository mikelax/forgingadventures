import { QUOTE } from '../actions/loungeMessage';

export default function loungeMessageReducer(state = {}, action) {

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
