// @flow

import bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { createServer } from 'http';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { Model } from 'objection';

import schema from 'schemas';

import index from 'routes/index';

import knex from 'services/knex';

import logger from 'services/logger';

import logging from 'middleware/logging';
import { checkJwt, checkJwtForGraphiql } from 'middleware/security';

const app = express();
const server = createServer(app);

app.set('port', process.env.PORT || 3001);

// set the view engine to ejs
app.set('view engine', 'ejs');
// wire up express morgan with central logging system
app.use(logging());
// set up helmet, basic security checklist
app.use(helmet({
  dnsPrefetchControl: false,
  hsts: false // TODO need dev to run under https first
}));

// wire misc things together


Model.knex(knex);

// set up basic middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(cors());

console.log('schema', schema)

// graphql endpoints
if (config.get('graphql.graphiql')) {
  app.use('/graphql', bodyParser.json(), checkJwtForGraphiql(), graphqlExpress((req, res) => ({
    schema,
    context: { req, res }
  })));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:3001/subscriptions`
  }));
} else {
  app.use('/graphql', bodyParser.json(), checkJwt(), graphqlExpress((req, res) => ({
    schema,
    context: { req, res }
  })));
}

// set up basic routes
app.use('/silent', (req, res) => {
  res.render('pages/silent', {
    clientID: config.get('auth0.clientId'),
    domain: config.get('auth0.domain'),
    redirectUri: config.get('auth0.redirectUri')
  });
});
app.use('/api', index);

// Start server
server.listen(app.get('port'), () => {
  logger.info(`Find the server at: http://localhost:${app.get('port')}/`);

  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server,
    path: '/subscriptions',
  });
});

export default app;
