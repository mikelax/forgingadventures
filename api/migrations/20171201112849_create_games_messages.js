exports.up = function(knex) {
  return knex.schema.createTable('game_messages', (table) => {
    table.increments().primary();

    table.integer('gameId').unsigned().notNullable();
    table.foreign('gameId').references('games.id');

    table.text('message');

    table.timestamp('deleted_at');
    table.timestamps(true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_messages');
};
