import auth0 from 'auth0-js';
import Bluebird from 'bluebird';

import {requestedScopes, getAccessToken, getAccessTokenExpiresAt, setSession} from './login';

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
    tokenRenewalTimeout = setTimeout(() => {
      renewToken();
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


///// private

function renewToken() {
  webAuth.renewAuth(
    {
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      redirectUri: process.env.REACT_APP_AUTH0_RENEWAL_REDIRECT_URI,
      usePostMessage: true
    }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        setSession(result);
      }
    }
  );
}




