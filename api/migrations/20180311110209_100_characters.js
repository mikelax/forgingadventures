exports.up = function(knex) {
  return knex.schema.createTable('characters', (table) => {
    table.increments().primary();

    table.string('name', 128).notNullable();
    table.jsonb('profile_image');
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id');
    table.integer('label_id').unsigned().notNullable();
    table.foreign('label_id').references('game_labels.id');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  })
    .then(() => {
      return knex.schema.table('game_players', (table) => {
        table.integer('character_id');
        table.foreign('character_id').references('characters.id');
      });
    });
};

exports.down = function(knex) {
  return knex.schema.table('game_players', (table) => {
    table.dropForeign('character_id');
    table.dropColumn('character_id');
  })
    .then(() => {
      return knex.schema.dropTable('characters');
    });
};
