// import Auth0Lock from 'auth0-lock';
import Auth0 from 'auth0-js';
import Bluebird from 'bluebird';

import { scheduleRenewal, clearRenewalTimer, renewToken, logout } from './webAuth';

export const requestedScopes = 'openid profile email create:characters delete:characters create:games delete:games create:posts delete:posts view:gamelabels';

// const lock = new Auth0Lock(process.env.REACT_APP_AUTH0_CLIENT_ID, process.env.REACT_APP_AUTH0_DOMAIN, {
//   container: 'auth0Lock',
//   initialScreen: 'login',
//   theme: {
//     logo: 'https://s3.amazonaws.com/forgingadventures-resources/auth0/fa_logo.png',
//     primaryColor: '#6FA1BA', // default #ea5323
//     authButtons: {
//       'twitch': {
//         primaryColor: '#6441A4',  // Twitch Purple
//         icon: 'https://s3.amazonaws.com/forgingadventures-resources/auth0/twitch_glitch_wh_logo.svg'
//       }
//     }
//   },
//   languageDictionary: {
//     title: 'Let\'s get started!'
//   },
//   auth: {
//     redirectUrl: process.env.REACT_APP_AUTH0_REDIRECT_URI,
//     responseType: 'token id_token',
//     audience: process.env.REACT_APP_AUTH0_AUDIENCE,
//     params: {
//       scope: requestedScopes
//     }
//   }
// });

const hostedAuth = new Auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  responseType: 'token id_token',
  scope: requestedScopes
});

export function showLogin() {
  // return lock.show();
  hostedAuth.authorize();
}

export function processLockCallback() {
  // lock.on('authenticated', (authResult) => {
  //   setSession(authResult);
  // });

  // lock.on('authorization_error', (e) => {
  //   console.log('lock error', e);
  // });

  hostedAuth.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult);
    } else if (err) {
      console.log('lock error', err);
    }
  });
}

export function processAuth() {
  return Bluebird.try(() => {
    if (isAuthenticated()) {
      return getAccessToken();
    } else {
      return renewToken()
        .then(res => res.accessToken);
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
  logout();
}
