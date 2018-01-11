import Bluebird from 'bluebird';
import User from 'models/user';

/**
 * Get an FA User object by Auth0 sub attribute
 * @param {string} auth0UserId - The Auth0 sub attribute
 */
export default function getUser(auth0UserId) {
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
