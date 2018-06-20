exports.up = function (knex) {
  return knex.schema.table('game_messages', (table) => {
    table.integer('character_id');
    table.foreign('character_id').references('characters.id');

    table.enu('post_type', ['ic', 'ooc']);
  })
    .then(() => (
      knex('game_messages')
        .update({
          postType: 'ooc'
        })
    ))
    .then(() => (
      knex.schema.alterTable('game_messages', (table) => {
        table.text('post_type').notNullable().alter();
      })
    ));
};

exports.down = function (knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropColumn('post_type');
    table.dropColumn('character_id');
  });
};
