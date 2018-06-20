exports.up = function(knex) {
  return knex('game_lounges').del()
    .then(() => knex('game_messages').del())
    .then(() => knex('games').del())
    .then(() => {
      return knex.schema.alterTable('games', (table) => {
        table.integer('label_id').notNullable();
        table.foreign('label_id').references('game_labels.id');
      });
    })
    .then(() => {
      return knex.schema.createTable('game_players', (table) => {
        table.increments().primary();

        table.integer('user_id').notNullable();
        table.foreign('user_id').references('users.id');
        table.integer('game_id').notNullable();
        table.foreign('game_id').references('games.id');
        table.enu('status', ['game-master', 'pending', 'accepted', 'rejected', 'quit', 'kicked']).notNullable();

        table.timestamp('deleted_at');
        table.timestamps(true, true);
      });
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_players')
    .then(() => {
      return knex.schema.table('games', (table) => {
        table.dropForeign('label_id');
        table.dropColumn('label_id');
      });
    });
};
