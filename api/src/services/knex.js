import _ from 'lodash';
import config from 'config';
import { knexSnakeCaseMappers } from 'objection';

import logger from 'services/logger';

const knex = require('knex')({
  client: 'pg',
  connection: config.get('database.connection'),
  searchPath: config.get('database.searchPath'),
  pool: config.get('database.pool'),
  ...knexSnakeCaseMappers()
});

export default knex;

const times = {};

knex
  .on('query', (query) => {
    const uid = query.__knexQueryUid;
    times[uid] = {
      query,
      startTime: Date.now()
    };
  })
  .on('query-response', (response, query) => {
    const uid = query.__knexQueryUid;

    const { startTime } = times[uid];
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    const bindings = _(query.bindings).map((b) => { return _.isObject(b) ? JSON.stringify(b) : b; }).join(',');

    logger.sql(query.sql, `- [${bindings}] - ${elapsedTime.toFixed(3)} ms`);

    delete times[uid];
  });
