exports.up = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "game_lounges"
    DROP CONSTRAINT "game_lounges_meta_check",
    ADD CONSTRAINT "game_lounges_meta_check" 
    CHECK ("meta" IN ('join', 'kicked', 'accepted', 'rejected', 'quit'))
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "game_lounges"
    DROP CONSTRAINT "game_lounges_meta_check",
    ADD CONSTRAINT "game_lounges_meta_check" 
    CHECK ("meta" IN ('join'))
  `);
};
