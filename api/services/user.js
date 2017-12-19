import _ from 'lodash';
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
