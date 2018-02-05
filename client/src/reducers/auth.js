import { AUTH_FAILURE, AUTH_SUCCESS, LOGOUT_SUCCESS } from '../actions/auth';
import { isAuthenticated } from '../services/login';

export default function authReducer(state = {
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
}, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        accessToken: action.accessToken
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
        isAuthenticated: false,
        accessToken: null
      };
    default:
      return state;
  }
}
