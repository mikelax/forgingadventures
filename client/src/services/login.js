import Auth0Lock from 'auth0-lock';
import Bluebird from 'bluebird';
import history from "./history";

import { scheduleRenewal, clearRenewalTimer } from './webAuth';

export const requestedScopes = 'openid profile email create:characters delete:characters create:games delete:games create:posts delete:posts view:gamelabels';

const lock = new Auth0Lock(process.env.REACT_APP_AUTH0_CLIENT_ID, process.env.REACT_APP_AUTH0_DOMAIN, {
  container: 'auth0Lock',
  initialScreen: 'login',
  theme: {
    logo: 'https://s3.amazonaws.com/forgingadventures-resources/auth0/fa_anvil_rust_logo.png',
    primaryColor: '#985e6d', // default #ea5323
    authButtons: {
      'twitch': {
        primaryColor: '#6441A4',  // Twitch Purple
        icon: 'https://s3.amazonaws.com/forgingadventures-resources/auth0/twitch_glitch_wh_logo.svg'
      }
    }
  },
  languageDictionary: {
    title: 'Let\'s get started!'
  },
  auth: {
    redirectUrl: process.env.REACT_APP_AUTH0_REDIRECT_URI,
    responseType: 'token id_token',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    params: {
      scope: requestedScopes
    }
  }
});

export function showLogin() {
  return lock.show();
}

export function processAuth() {
  return Bluebird.try(() => {
    if (isAuthenticated()) {
      return getAccessToken();
    } else {
      return new Bluebird((resolve, reject) => {
        lock.on('authenticated', (authResult) => {
          setSession(authResult);

          resolve(authResult.accessToken);
        });

        lock.on('authorization_error', (e) => {
          reject(e);
        });
      });
    }
  })
    .tap(() => scheduleRenewal());
}

export function setSession(authResult) {
  // Set the time that the access token will expire at
  let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  // scope attribute will be empty of all scopes are returned, so use scopes defined here to store in browser
  const scopes = authResult.scope || requestedScopes || '';
  // Roles claim is namespaced but not unique between environments (tenants)
  const roles = authResult.idTokenPayload['https://forgingadventures.com/claims/roles'];

  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  localStorage.setItem('scopes', JSON.stringify(scopes));
  localStorage.setItem('roles', JSON.stringify(roles));
}

export function isAuthenticated() {
  // Check whether the current time is past the
  // access token's expiry time
  let expiresAt = getAccessTokenExpiresAt();

  return new Date().getTime() < expiresAt;
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getAuthorizationHeader() {
  if (isAuthenticated()) {
    const token = getAccessToken();

    if (token) {
      return {
        Authorization: `Bearer ${token}`
      };
    }
  }
}

export function getAccessTokenExpiresAt() {
  return JSON.parse(localStorage.getItem('expires_at'));
}

export function authLogout() {
  // Clear access token and ID token from local storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('scopes');
  localStorage.removeItem('roles');

  clearRenewalTimer();

  // navigate to the home route
  history.replace('/');
}
