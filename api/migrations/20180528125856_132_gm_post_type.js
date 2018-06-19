exports.up = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "game_messages"
    DROP CONSTRAINT "game_messages_post_type_check",
    ADD CONSTRAINT "game_messages_post_type_check" 
    CHECK ("post_type" IN ('gm', 'ic', 'ooc'))
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "game_messages"
    DROP CONSTRAINT "game_messages_post_type_check",
    ADD CONSTRAINT "game_messages_post_type_check" 
    CHECK ("post_type" IN ('ic', 'ooc'))
  `);
};
