exports.up = function(knex) {
  return knex
    .schema
    .alterTable('game_lounges', (t) => {
      t.text('message').notNullable().alter();
    })
    .then(() => {
      return knex
        .schema
        .alterTable('game_messages', (t) => {
          t.text('message').notNullable().alter();
        });
    });
};

exports.down = function(knex) {
  return knex
    .schema
    .alterTable('game_lounges', (t) => {
      t.json('message').notNullable().alter();
    })
    .then(() => {
      return knex
        .schema
        .alterTable('game_messages', (t) => {
          t.json('message').notNullable().alter();
        });
    });
};
