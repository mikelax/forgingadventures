exports.up = function(knex) {
  return knex.schema.table('games', (table) => {
    table.jsonb('gameImage');
  });
};

exports.down = function(knex) {
  return knex.schema.table('games', (table) => {
    table.dropColumn('gameImage');
  });
};
