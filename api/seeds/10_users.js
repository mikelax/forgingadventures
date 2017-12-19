exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() =>
      knex('users').insert([
        {
          auth0UserId: 'oauth2|twitch|177040760'  // mike twitch
        },
        {
          auth0UserId: 'google-oauth2|103015308867869178931'  // nazar gmail
        }
      ]));
};
