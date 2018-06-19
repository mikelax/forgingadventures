exports.up = function(knex) {
  return knex.schema.createTable('game_lounges', (table) => {
    table.increments().primary();

    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id');

    table.integer('game_id').notNullable();
    table.foreign('game_id').references('games.id');

    table.json('message').notNullable();

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_lounges');
};
