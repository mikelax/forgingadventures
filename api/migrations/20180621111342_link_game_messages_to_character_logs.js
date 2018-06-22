exports.up = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.integer('character_log_id');
    table.foreign('character_log_id').references('character_logs.id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropColumn('character_log_id');
  });
};
