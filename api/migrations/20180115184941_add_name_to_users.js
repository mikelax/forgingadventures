exports.up = function(knex) {
  return knex
    .schema
    .alterTable('users', (t) => {
      t.string('name');
    });
};

exports.down = function(knex) {
  return knex
    .schema
    .table('users', (t) => {
      t.dropColumn('name');
    });
};
