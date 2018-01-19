import _ from 'lodash';
import Bluebird from 'bluebird';
import User from 'models/user';
import { getAuth0User } from './auth0';

/**
 * Get an FA User object by Auth0 sub attribute
 * @param {string} auth0UserId - The Auth0 sub attribute
 */
export function getUser(auth0UserId) {
  return Bluebird.try(() => {
    return User
      .query()
      .select('*')
      .where('auth0UserId', auth0UserId)
      .then((dbResult) => {
        if (!dbResult.length) {
          throw new Error('User not found');
        }

        return dbResult[0];
      });
  });
}

export function getOrCreateUserByAuth0Id(auth0UserId) {
  return Bluebird.try(() => {
    return User
      .query()
      .where('auth0UserId', auth0UserId)
      .then((dbResult) => {
        if (!dbResult.length) {
          return getAuth0User(auth0UserId, 'user_metadata,app_metadata,name,picture')
            .then((auth0Response) => {
              const {
                name, picture, user_metadata = {}, app_metadata = {} // eslint-disable-line camelcase
              } = auth0Response.data;

              const userMetadata = _.merge({
                profileImage: {
                  imageUrl: picture
                }
              }, user_metadata);

              return User
                .query()
                .insert({
                  name,
                  auth0UserId,
                  userMetadata,
                  appMetadata: app_metadata
                })
                .returning('*');
            });
        }

        return dbResult[0];
      });
  });
}

/**
 * Patch user to update the Auth0 user and app metadata objects
 * @param {string} auth0UserId - The Auth0 user id
 * @param {object} userMetadata - Auth0 user metadata object
 * @param {object} appMetadata - Auth0 app metadata object
 */
export function patchUserAuth0Metadata(auth0UserId, userMetadata, appMetadata) {
  return Bluebird.try(() => {
    return User
      .query()
      .patch({
        userMetadata,
        appMetadata
      })
      .where('auth0UserId', auth0UserId)
      .returning('*');
  });
}
