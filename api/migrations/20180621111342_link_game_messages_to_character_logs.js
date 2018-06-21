exports.up = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.integer('character_log_id').notNullable();
    table.foreign('character_log_id').references('character_logs.id');
    table.dropColumn('character_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropColumn('character_log_id').notNullable().references('character_logs.id');
    table.integer('character_id').notNullable().references('characters.id');
  });
};
