exports.up = function(knex) {
  return knex.schema.table('characters', (table) => {
    table.integer('last_character_log_id');
    table.foreign('last_character_log_id').references('character_logs.id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('characters', (table) => {
    table.dropColumn('last_character_log_id');
  });
};
