exports.up = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "user_uploads"
    DROP CONSTRAINT "user_uploads_type_check",
    ADD CONSTRAINT "user_uploads_type_check" 
    CHECK (type IN ('userProfile', 'characterProfile', 'gameImage', 'messageImage'))
  `);
};

exports.down = function(knex) {
  return knex.schema.raw(`
    ALTER TABLE "user_uploads"
    DROP CONSTRAINT "user_uploads_type_check",
    ADD CONSTRAINT "user_uploads_type_check" 
    CHECK (type IN ('userProfile', 'characterProfile'))
  `);
};
