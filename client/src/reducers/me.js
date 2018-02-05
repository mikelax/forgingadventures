import { GET_MY_DETAILS_SUCCESS, GET_MY_DETAILS_FAILURE } from '../actions/me';

export default function authReducer(state = {
  loading: true,
  error: null,
}, action) {
  switch (action.type) {
    case GET_MY_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        me: action.me
      };
    case GET_MY_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}
