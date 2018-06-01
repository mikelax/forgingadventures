// @flow

import _ from 'lodash';
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
import routes from 'routes';
import knex from 'services/knex';
import logger from 'services/logger';
import logging from 'middleware/logging';
import { checkJwt } from 'middleware/security';

import loader from './loaders';

const app = express();
const server = createServer(app);

app.set('port', process.env.PORT || 3001);

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

// JWT
app.use(checkJwt());

// graphql endpoints
app.use('/api/graphql', graphqlExpress((req, res) => ({
  schema,
  context: { req, res, loaders: loader() }
})));

if (config.get('graphql.graphiql')) {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/api/graphql',
    // note that graphiql is only enabled on dev hence the hardcoded following line
    subscriptionsEndpoint: 'ws://localhost:3001/api/subscriptions'
  }));
}

app.use('/api', routes);

// Start server
server.listen(app.get('port'), () => {
  logger.info(`Find the server at: http://localhost:${app.get('port')}/`);

  SubscriptionServer.create({
    execute,
    subscribe,
    schema,
    onOperation: (message, params) => {
      return _.merge({}, params, {
        context: {
          loaders: loader({ cache: false })
        }
      });
    }
  }, {
    server,
    path: '/api/subscriptions'
  });
});

export default app;
