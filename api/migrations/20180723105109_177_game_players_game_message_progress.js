exports.up = function(knex) {
  return knex.schema.table('game_players', (table) => {
    table.integer('progress_game_message_id');
    table.foreign('progress_game_message_id').references('game_messages.id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('game_players', (table) => {
    table.dropColumn('progress_game_message_id');
  });
};
