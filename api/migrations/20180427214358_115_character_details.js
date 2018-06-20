exports.up = function(knex) {
  return knex.schema.table('characters', (table) => {
    table.jsonb('character_details');
  });
};

exports.down = function(knex) {
  return knex.schema.table('characters', (table) => {
    table.dropColumn('character_details');
  });
};
