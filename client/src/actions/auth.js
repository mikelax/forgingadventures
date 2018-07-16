export const AUTH_FAILURE = 'auth_failure';
export const AUTH_SUCCESS = 'auth_success';

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
