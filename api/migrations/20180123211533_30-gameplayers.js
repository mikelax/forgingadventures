exports.up = function(knex) {
  return knex('game_lounges').del()
    .then(() => knex('game_messages').del())
    .then(() => knex('games').del())
    .then(() => {
      return knex.schema.alterTable('games', (table) => {
        table.integer('labelId').notNullable();
        table.foreign('labelId').references('game_labels.id');
      });
    })
    .then(() => {
      return knex.schema.createTable('game_players', (table) => {
        table.increments().primary();

        table.integer('userId').notNullable();
        table.foreign('userId').references('users.id');
        table.integer('gameId').notNullable();
        table.foreign('gameId').references('games.id');
        table.enu('status', ['pending', 'accepted', 'rejected', 'quit', 'kicked']).notNullable();

        table.timestamp('deleted_at');
        table.timestamps(true, true);
      });
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_players')
    .then(() => {
      return knex.schema.table('games', (table) => {
        table.dropForeign('labelId');
        table.dropColumn('labelId');
      });
    });
};
