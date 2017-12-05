exports.up = function(knex) {
  return knex.schema.createTable('games', (table) => {
    table.increments().primary();

    table.string('title');
    table.text('scenario');
    table.text('overview');

    // JSON column to contain
    // minPlayers
    // maxPlayers
    // skillLevel
    // postingFrequency
    table.jsonb('gameSettings');

    table.text('notes');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('games');
};
