exports.up = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "game_messages"
    DROP CONSTRAINT "game_messages_postType_check",
    ADD CONSTRAINT "game_messages_postType_check" 
    CHECK ("postType" IN ('gm', 'ic', 'ooc'))
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "game_messages"
    DROP CONSTRAINT "game_messages_postType_check",
    ADD CONSTRAINT "game_messages_postType_check" 
    CHECK ("postType" IN ('ic', 'ooc'))
  `);
};
