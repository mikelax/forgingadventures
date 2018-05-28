exports.up = function (knex) {
  return knex.schema.table('game_messages', (table) => {
    table.integer('characterId');
    table.foreign('characterId').references('characters.id');

    table.enu('postType', ['ic', 'ooc']);
  })
    .then(() => (
      knex('game_messages')
        .update({
          postType: 'ooc'
        })
    ))
    .then(() => (
      knex.schema.alterTable('game_messages', (table) => {
        table.text('postType').notNullable().alter();
      })
    ));
};

exports.down = function (knex) {
  return knex.schema.table('game_messages', (table) => {
    table.dropColumn('postType');
    table.dropColumn('characterId');
  });
};
