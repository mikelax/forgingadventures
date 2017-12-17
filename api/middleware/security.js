import _ from 'lodash';
import config from 'config';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export function checkJwt() {
  return jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.get('auth0.domain')}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: config.get('auth0.audience'),
    issuer: `https://${config.get('auth0.domain')}/`,
    algorithms: ['RS256']
  });
}

export function checkJwtForGraphiql() {
  return (req, res, next) => {
    const graphiqlEnabled = config.get('graphql.graphiql');
    const graphiqlQuery = _.get(req, 'headers.referer', '').match('/graphiql?');

    if (graphiqlEnabled && graphiqlQuery) {
      next();
    } else {
      checkJwt()(req, res, next);
    }
  };
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

export function checkAuth0Secret() {
  return (req, res, next) => {
    if (_.get(req.body, 'meta.sharedSecret') === config.get('auth0.sharedSecret')) {
      next();
    } else {
      nextError(new Error('Invalid Request'));
    }

    function nextError(err) {
      err.status = 401;
      return next(err);
    }
  };
}

