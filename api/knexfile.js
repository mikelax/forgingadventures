const config = require('config');
const { knexSnakeCaseMappers } = require('objection');

module.exports = {
  client: 'pg',
  connection: config.get('database.connection'),
  searchPath: config.get('database.searchPath'),
  ...knexSnakeCaseMappers()
};
