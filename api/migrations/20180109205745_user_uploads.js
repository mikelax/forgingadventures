exports.up = function(knex) {
  return knex.schema.createTable('user_uploads', (table) => {
    table.increments().primary();

    table.integer('userId').notNullable();
    table.foreign('userId').references('users.id');
    table.string('publicId').notNullable().comment('The file ID used to generate URLs for this file');
    table.unique('publicId');
    table.enu('type', ['userProfile', 'characterProfile']).notNullable();
    table.string('originalFilename').notNullable();
    table.string('mimeType').notNullable();
    table.integer('size').notNullable().comment('Original file size in bytes');

    table.timestamp('deleted_at');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_uploads');
};
