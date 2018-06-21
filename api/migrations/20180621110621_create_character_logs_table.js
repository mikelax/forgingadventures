exports.up = function(knex) {
  return knex.schema.createTable('character_logs', (table) => {
    table.increments().primary();

    table.integer('character_id').notNullable();
    table.foreign('character_id').references('characters.id');

    table.string('change_description');
    table.jsonb('character_details');

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('character_logs');
};
