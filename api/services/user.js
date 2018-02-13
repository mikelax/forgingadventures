import _ from 'lodash';
import Bluebird from 'bluebird';
import User from 'models/user';
import { getAuth0User, patchAuth0Metadata } from './auth0';

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

export function updateUserAndAuth0(updatePayload, auth0UserId) {
  return getUser(auth0UserId)
    .then((user) => {
      if (!(user.completedAt)) {
        updatePayload.completedAt = new Date();
      }

      return User
        .query()
        .patch(updatePayload)
        .where({ auth0UserId })
        .first()
        .returning('*');
    })
    .tap((user) => {
      const userMetadata = {
        name: user.name,
        username: user.username,
        profileImage: _.get(user, 'profileImage.url')
      };

      const appMetadata = {
        faUserId: user.id,
        signupCompleted: user.completedAt
      };

      return patchAuth0Metadata(auth0UserId, userMetadata, appMetadata);
    });
}

export function runIfContextHasUser(context, runFn) {
  const token = _.get(context, 'req.user.sub');

  if (token) {
    return getUser(token)
      .then(user => runFn(user));
  }
}
