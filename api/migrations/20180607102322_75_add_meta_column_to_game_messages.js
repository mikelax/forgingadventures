exports.up = function (knex) {
  return knex.schema.table('game_messages', (table) => {
    table.jsonb('meta');
  });
};

exports.down = function (knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropColumn('meta');
  });
};
