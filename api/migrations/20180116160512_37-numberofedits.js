exports.up = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.integer('numberEdits').notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropColumn('numberEdits');
  });
};
