exports.up = function(knex) {
  return knex.schema.createTable('game_labels', (table) => {
    table.increments().primary();

    table.string('displayName').notNullable();
    table.string('shortName', 16).notNullable();
    table.jsonb('aliases');
    table.integer('displayOrder').notNullable().defaultTo(100);

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  })
    .then(() => {
      return knex('game_labels').insert([
        {
          displayName: 'Dungeons & Drangons (5th Edition)',
          shortName: 'D&D 5e',
          aliases: JSON.stringify(['dndnext', 'DnD', 'D&D', 'dnd5e', '5th edition']),
          displayOrder: 10
        },
        {
          displayName: 'Pathfinder Roleplaying Game',
          shortName: 'Pathfinder',
          displayOrder: 50
        },
        {
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
