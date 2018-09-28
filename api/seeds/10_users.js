exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() =>
      knex('users').insert([
        {
          auth0UserId: 'oauth2|twitch|177040760',  // mike twitch
          name: 'Mike'
        },
        {
          auth0UserId: 'oauth2|twitch|196175247',  // nazar twitch
          name: 'Nazar'
        }
      ]));
};
