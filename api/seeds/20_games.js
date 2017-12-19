exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('games').del()
    .then(() => {
      return knex('users').select('id')
        .where('auth0UserId', 'oauth2|twitch|177040760')
        .then(userRs => userRs[0].id)
        .then(userId =>
          // Inserts seed entries
          knex('games').insert([
            {
              title: 'First Dungeon Crawl Game',
              scenario: 'Old-school feel - monsters and gold',
              overview: 'You are gathered at the entrace of the dungeon.',
              userId,
              notes: 'have fun',
              gameSettings: {
                minPlayers: 3,
                maxPlayers: 5,
                skillLevel: 2,
                postingFrequency: 3
              }
            }
          ]));
    });
};
