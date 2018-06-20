exports.up = function(knex) {
  return knex.schema.createTable('game_labels', (table) => {
    table.integer('id').notNullable().primary();

    table.string('display_name').notNullable();
    table.string('short_name', 16).notNullable();
    table.jsonb('aliases');
    table.integer('display_order').notNullable().defaultTo(100);

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  })
    .then(() => {
      return knex('game_labels').insert([
        {
          id: 1,
          displayName: 'Dungeons & Drangons (5th Edition)',
          shortName: 'D&D 5e',
          aliases: JSON.stringify(['dndnext', 'DnD', 'D&D', 'dnd5e', '5th edition']),
          displayOrder: 10
        },
        {
          id: 2,
          displayName: 'Pathfinder Roleplaying Game',
          shortName: 'Pathfinder',
          displayOrder: 50
        },
        {
          id: 3,
          displayName: 'Starfinder',
          shortName: 'Starfinder',
          displayOrder: 100
        }
      ]);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game_labels');
};
