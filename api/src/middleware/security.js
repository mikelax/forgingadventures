import _ from 'lodash';
import config from 'config';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import { getUser } from 'services/user';

export function checkJwt() {
  return jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.get('auth0.faClient.domain')}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: config.get('auth0.faClient.audience'),
    issuer: `https://${config.get('auth0.faClient.domain')}/`,
    algorithms: ['RS256'],

    // skip JWT checking if no token is available - i.e. read graphQL queries
    credentialsRequired: false,
    // but check token expiry if it does exist
    alwaysThrowOnExpiredToken: true
  });
}

export function checkScopes(scopes) {
  return (req, res, next) => {
    if (!req.user || typeof req.user.scope !== 'string') {
      return nextError('Invalid user or scopes within JWT');
    }

    const tokenScopes = req.user.scope.split(' ');
    const validScopes = _.intersection(tokenScopes, scopes);

    if (_.isArray(validScopes) && validScopes.length >= 1) {
      next();
    } else {
      nextError(new Error('Insufficient Scope Permission'));
    }

    function nextError(err) {
      err.status = 401;
      return next(err);
    }
  };
}

export function setDbUserByToken(req, res, next) {
  const token = req.user.sub;

  return getUser(token)
    .then((user) => {
      req.dbUser = user;
      next();
    })
    .catch(err => next(err));
}
