exports.up = function(knex) {
  return knex.schema.table('game_lounges', (table) => {
    table.integer('number_edits').notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('game_lounges', (table) => {
    table.dropColumn('number_edits');
  });
};
