exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    // drop deprecated columns
    table.dropColumn('user_metadata');
    table.dropColumn('app_metadata');

    // add new columns
    table.string('username');
    table.unique('username');

    table.string('timezone');
    table.jsonb('profile_image');
    table.timestamp('completed_at');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.jsonb('user_metadata');
    table.jsonb('app_metadata');

    table.dropColumn('username');
    table.dropColumn('timezone');
    table.dropColumn('profile_image');
    table.dropColumn('completed_at');
  });
};
