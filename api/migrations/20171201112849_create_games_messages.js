exports.up = function(knex) {
  return knex.schema.createTable('game_messages', (table) => {
    table.increments().primary();

    table.integer('game_id').unsigned().notNullable();
    table.foreign('game_id').references('games.id');

    table.text('message');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_messages');
};
