exports.up = function(knex) {
  return knex.schema.renameable('campaigns', 'games');
};

exports.down = function(knex) {
  return knex.schema.renameable('games', 'campaigns');
};
