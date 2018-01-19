exports.up = function(knex) {
  return knex.schema.createTable('game_lounges', (table) => {
    table.increments().primary();

    table.integer('userId').notNullable();
    table.foreign('userId').references('users.id');

    table.integer('gameId').notNullable();
    table.foreign('gameId').references('games.id');

    table.json('message').notNullable();

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_lounges');
};
