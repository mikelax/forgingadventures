exports.up = function(knex) {
  return knex.schema.createTable('characters', (table) => {
    table.increments().primary();

    table.string('name', 128).notNullable();
    table.jsonb('profileImage');
    table.integer('userId').unsigned().notNullable();
    table.foreign('userId').references('users.id');
    table.integer('labelId').unsigned().notNullable();
    table.foreign('labelId').references('game_labels.id');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  })
    .then(() => {
      return knex.schema.table('game_players', (table) => {
        table.integer('characterId');
        table.foreign('characterId').references('characters.id');
      });
    });
};

exports.down = function(knex) {
  return knex.schema.table('game_players', (table) => {
    table.dropForeign('characterId');
    table.dropColumn('characterId');
  })
    .then(() => {
      return knex.schema.dropTable('characters');
    });
};
