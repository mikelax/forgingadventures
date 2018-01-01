import React, { Component } from 'react';
import Auth0Lock from 'auth0-lock';

import Auth from '../../services/Auth/Auth';

import './Login.styl';

export default class Login extends Component {

  componentDidMount() {
    // Config documentation
    // https://auth0.com/docs/libraries/lock/v10/configuration#additionalsignupfields-array-
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
          scope: Auth.requestedScopes
        }
      }
    });

    lock.show();
  }

  render() {
    return (
      <div className="Login">
        <div className="container">
          <h1>
            Login
          </h1>
          <p>This page uses custom Auth0 Lock widget, as opposed to hosted login page.
            <br/>If you remove the container attribute it will display as a modal.</p>

          <div id="auth0Lock"></div>
        </div>
      </div>
    );
  }
}
