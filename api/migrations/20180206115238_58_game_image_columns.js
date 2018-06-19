exports.up = function(knex) {
  return knex.schema.table('games', (table) => {
    table.jsonb('game_image');
  });
};

exports.down = function(knex) {
  return knex.schema.table('games', (table) => {
    table.dropColumn('game_image');
  });
};
