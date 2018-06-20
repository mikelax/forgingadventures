exports.up = function(knex) {
  return knex.schema.createTable('user_uploads', (table) => {
    table.increments().primary();

    table.integer('user_id').notNullable();
    table.foreign('user_id').references('users.id');
    table.string('public_id').notNullable().comment('The file ID used to generate URLs for this file');
    table.unique('public_id');
    table.enu('type', ['userProfile', 'characterProfile']).notNullable();
    table.string('original_filename').notNullable();
    table.string('mime_type').notNullable();
    table.integer('size').notNullable().comment('Original file size in bytes');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_uploads');
};
