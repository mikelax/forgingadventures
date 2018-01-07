import {authLogout} from '../services/login';

export const AUTH_FAILURE = 'auth_failure';
export const AUTH_SUCCESS = 'auth_success';
export const LOGOUT_SUCCESS = 'logout-success';

export function logout() {
  return (dispatch) => {
    authLogout();
    dispatch({type: LOGOUT_SUCCESS});
  };
}

export function authFailure(error) {
  return {
    type: AUTH_FAILURE,
    error
  };
}

export function authSuccess(accessToken) {
  return {
    type: AUTH_SUCCESS,
    accessToken
  };
}
