exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments().primary();

    table.string('auth0UserId').notNullable();
    table.unique('auth0UserId');
    table.jsonb('userMetadata');
    table.jsonb('appMetadata');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  })
    .then(() => {
      return knex.schema.table('games', (table) => {
        table.integer('userId').notNullable();
        table.foreign('userId').references('users.id');
      });
    })
    .then(() => {
      return knex.schema.table('game_messages', (table) => {
        table.integer('userId').notNullable();
        table.foreign('userId').references('users.id');
      });
    });
};

exports.down = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropForeign('userId');
    table.dropColumn('userId');
  })
    .then(() => {
      return knex.schema.table('games', (table) => {
        table.dropForeign('userId');
        table.dropColumn('userId');
      });
    })
    .then(() => {
      return knex.schema.dropTable('users');
    });
};
