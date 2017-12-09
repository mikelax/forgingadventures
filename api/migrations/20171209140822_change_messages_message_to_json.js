exports.up = function(knex) {
  return knex
    .schema
    .alterTable('game_messages', (t) => {
      t.json('message').notNullable().alter();
    });
};

exports.down = function(knex) {
  return knex
    .schema
    .alterTable('game_messages', (t) => {
      t.string('message').notNullable().alter();
    });
};
