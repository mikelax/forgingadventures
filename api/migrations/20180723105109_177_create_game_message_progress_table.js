exports.up = function(knex) {
  return knex.schema.createTable('game_message_read_indicators', (table) => {
    table.increments().primary();

    table.integer('game_id');
    table.foreign('game_id').references('games.id');

    table.integer('game_message_id').notNullable();
    table.foreign('game_message_id').references('game_messages.id');

    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_message_read_indicators');
};
