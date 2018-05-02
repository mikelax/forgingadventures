exports.up = function(knex) {
  return knex.schema.table('characters', (table) => {
    table.jsonb('characterDetails');
  });
};

exports.down = function(knex) {
  return knex.schema.table('characters', (table) => {
    table.dropColumn('characterDetails');
  });
};
