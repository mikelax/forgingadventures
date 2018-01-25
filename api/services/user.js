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
      .where('auth0UserId', auth0UserId)
      .first()
      .then((dbResult) => {
        if (!(dbResult)) {
          throw new Error('User not found');
        }

        return dbResult;
      });
  });
}

export function getOrCreateUserByAuth0Id(auth0UserId) {
  return Bluebird.try(() => {
    return User
      .query()
      .where('auth0UserId', auth0UserId)
      .first()
      .then((dbResult) => {
        if (!(dbResult)) {
          return getAuth0User(auth0UserId, 'name,picture')
            .then((auth0Response) => {
              const { name, picture } = auth0Response.data;
              const profileImage = {
                url: picture
              };

              return User
                .query()
                .insert({
                  name,
                  auth0UserId,
                  profileImage
                })
                .returning('*');
            });
        }

        return dbResult;
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
