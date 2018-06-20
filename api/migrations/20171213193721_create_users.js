exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments().primary();

    table.string('auth0_user_id').notNullable();
    table.unique('auth0_user_id');
    table.jsonb('user_metadata');
    table.jsonb('app_metadata');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  })
    .then(() => {
      return knex.schema.table('games', (table) => {
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('users.id');
      });
    })
    .then(() => {
      return knex.schema.table('game_messages', (table) => {
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('users.id');
      });
    });
};

exports.down = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropForeign('user_id');
    table.dropColumn('user_id');
  })
    .then(() => {
      return knex.schema.table('games', (table) => {
        table.dropForeign('user_id');
        table.dropColumn('user_id');
      });
    })
    .then(() => {
      return knex.schema.dropTable('users');
    });
};
