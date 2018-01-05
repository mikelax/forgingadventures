import {AUTH_FAILURE, AUTH_PROCESSING, AUTH_SUCCESS, LOGOUT_SUCCESS} from '../actions/auth';
import {isAuthenticated} from '../services/login';

export default function authReducer(state = {
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
}, action) {
  switch (action.type) {
    case AUTH_PROCESSING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true
      };
    case AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.error,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false
      };
    default:
      return state;
  }
}
