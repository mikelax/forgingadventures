import axios from 'axios';
import config from 'config';

/**
 * Get an Auth0 User
 * @param {string} userId - The Auth0 user id (sub)
 * @param {string} fields -  A comma separated list of fields to include or exclude (depending on include_fields) from the result, empty to retrieve all fields
 */
export function getAuth0User(userId, fields) {
  return getAccessToken()
    .then((accessToken) => {
      return axios.get(`${config.get('auth0.managementClient.audience')}users/${userId}`,
        {
          params: {
            fields
          },
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          responseType: 'json'
        });
    });
}

/**
 * Call Auth0 Management API to resend User Verify Email
 * @param {string} userId - The Auth0 user id (sub)
 */
export function resendVerificationEmail(userId) {
  return getAccessToken()
    .then((accessToken) => {
      return axios.post(`${config.get('auth0.managementClient.audience')}jobs/verification-email`,
        {
          user_id: userId
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          responseType: 'json'
        });
    });
}

/**
 * Using Auth0 Management API Update the user_metadata and app_metadata fields for the given Auth0 user
 * @param {string} userId - The Auth0 user id (sub)
 * @param {object} userData - The new user_metadata object to save
 * @param {object} appData - The new app_metadata object to save
 */
export function patchAuth0Metadata(userId, userData, appData) {
  return getAccessToken()
    .then((accessToken) => {
      return axios.patch(`${config.get('auth0.managementClient.audience')}users/${userId}`, {
        user_metadata: userData,
        app_metadata: appData
      },
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'json'
      });
    })
    .then(() => {
      return {
        userMetadata: userData,
        appMetadata: appData
      };
    });
}

/**
 * Get an access token for the Auth0 Management API
 * TODO - Eventually this should cache the token as it will be valid for 24 hours
 */
function getAccessToken() {
  return axios.post(`https://${config.get('auth0.faClient.domain')}/oauth/token`,
    {
      grant_type: 'client_credentials',
      client_id: config.get('auth0.managementClient.clientId'),
      client_secret: config.get('auth0.managementClient.clientSecret'),
      audience: config.get('auth0.managementClient.audience')
    },
    {
      headers: { 'content-type': 'application/json' },
      responseType: 'json'
    })
    .then(response => response.data.access_token);
}
