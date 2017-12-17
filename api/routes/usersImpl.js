import _ from 'lodash';
import User from 'models/user';

export default function postUsers() {
  return (req, res, next) => {
    const user = _.pick(req.body.data, ['auth0UserId', 'userMetadata', 'appMetadata']);

    User
      .query()
      .select('id')
      .where('auth0UserId', user.auth0UserId)
      .then((dbUser) => {
        if (dbUser.length) {
          // Patch existing User
          return User
            .query()
            .patch({
              userMetadata: user.userMetadata,
              appMetadata: user.appMetadata
            })
            .where('auth0UserId', user.auth0UserId)
            .returning('*');
        }

        // Create new User
        return User
          .query()
          .insert(user)
          .returning('*');
      })
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((error) => {
        next(error);
      });
  };
}
