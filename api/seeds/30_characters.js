exports.seed = function(knex, Promise) {
  return knex('characters').del()
    .then(() => {
      return knex('users').select('id')
        .where('auth0UserId', 'oauth2|twitch|177040760')
        .then(userRs => userRs[0].id)
        .then(userId =>
          // Inserts seed entries
          knex('characters').insert([
            {
              name: 'Mike Test Character',
              userId,
              labelId: 1
            }
          ])
            .returning('*')
        );
    })
    .then(() => {
      return knex('users').select('id')
        .where('auth0UserId', 'google-oauth2|103015308867869178931')
        .then(userRs => userRs[0].id)
        .then(userId =>
          // Inserts seed entries
          knex('characters').insert([
            {
              name: 'Nazar Test Character',
              userId,
              labelId: 1
            }
          ])
            .returning('*')
        );
    });
};
