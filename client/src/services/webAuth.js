import auth0 from 'auth0-js';
import Bluebird from 'bluebird';

import { getAccessToken, getAccessTokenExpiresAt, requestedScopes, setSession } from './login';

const webAuth = new auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  responseType: 'token id_token',
  scope: requestedScopes
});

let tokenRenewalTimeout;

export function getProfile() {

  return new Bluebird((resolve, reject) => {
    let accessToken = getAccessToken();

    webAuth.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        resolve(profile);
      } else {
        reject(err);
      }
    });
  });

}

export function scheduleRenewal() {
  const expiresAt = getAccessTokenExpiresAt();
  const delay = expiresAt - Date.now();

  if (delay > 0) {
    clearRenewalTimer();
    tokenRenewalTimeout = setTimeout(() => {
      renewToken()
        .then(() => scheduleRenewal());
    }, delay);
  }
}

export function clearRenewalTimer() {
  clearTimeout(tokenRenewalTimeout);
}

export function userHasScopes(scopes) {
  if (!localStorage.getItem('scopes')) {
    return false;
  }

  const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');

  return scopes.every(scope => grantedScopes.includes(scope));
}


export function renewToken() {
  return new Bluebird((resolve, reject) => {
    webAuth.checkSession({
        scope: requestedScopes
      }, (err, result) => {
        if (err) {
          reject(new Error(err));
        } else {
          setSession(result);
          resolve(result);
        }
      }
    );
  });
}

export function logout() {
  webAuth.logout({
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    // fixme - add the following to a base url .env.local
    returnTo: 'http://localhost:3000'
  });
}


