exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    // drop deprecated columns
    table.dropColumn('userMetadata');
    table.dropColumn('appMetadata');

    // add new columns
    table.string('username');
    table.unique('username');

    table.string('timezone');
    table.jsonb('profileImage');
    table.timestamp('completedAt');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.jsonb('userMetadata');
    table.jsonb('appMetadata');

    table.dropColumn('username');
    table.dropColumn('timezone');
    table.dropColumn('jsonb');
    table.dropColumn('completedAt');
  });
};
