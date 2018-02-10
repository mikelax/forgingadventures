exports.up = function (knex) {
  return knex.schema.table('game_lounges', (table) => {
    table.enu('meta', ['join']);
  });
};

exports.down = function (knex) {
  return knex.schema.table('game_lounges', (table) => {
    table.dropColumn('meta');
  });
};
