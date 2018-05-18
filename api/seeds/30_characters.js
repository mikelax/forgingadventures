exports.seed = function (knex, Promise) {
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
              labelId: 1,
              characterDetails: {
                xp: 10,
                ac: 5,
                health: { hitDie: '5d', maxHitPoints: 1, currentHitPoints: 0 },
                traits: {
                  sex: 'other',
                  race: 'elf',
                  alignment: 'lg',
                  background: 'acolyte',
                  primaryClass: 'barbarian',
                  featuresAndTraits: 'feat',
                  backgroundInformation: 'back',
                  physicalCharacteristics: 'char'
                },
                abilities: {
                  wisdom: {
                    total: 5,
                    modifier: -3,
                    baseValue: 5,
                    raceBonus: 0,
                    savingThrows: true
                  },
                  charisma: {
                    total: 6, modifier: -2, baseValue: 6, raceBonus: 0, savingThrows: true
                  },
                  strength: {
                    total: 1, modifier: -5, baseValue: 1, raceBonus: 0, savingThrows: true
                  },
                  dexterity: {
                    total: 2, modifier: -4, baseValue: 2, raceBonus: 0, savingThrows: false
                  },
                  constitution: {
                    total: 3, modifier: -4, baseValue: 3, raceBonus: 0, savingThrows: true
                  },
                  intelligence: {
                    total: 4, modifier: -3, baseValue: 4, raceBonus: 0, savingThrows: true
                  }
                },
                proficiency: 2,
                primaryLevel: 1
              }
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
              labelId: 1,
              profileImage: {
                url: 'https://res.cloudinary.com/forgingadventures/image/upload/c_fill,g_auto,w_348,h_456/v1525091513/S1R2hF4pM.png',
                publicId: 'S1R2hF4pM',
                userUploadId: 2
              },
              characterDetails: {
                xp: 0,
                ac: 5,
                health: { hitDie: '4d', maxHitPoints: 1, currentHitPoints: 0 },
                traits: {
                  sex: 'other',
                  race: 'dwarf',
                  alignment: 'n',
                  background: 'acolyte',
                  primaryClass: 'barbarian',
                  featuresAndTraits: 'dfg',
                  backgroundInformation: '',
                  physicalCharacteristics: 'dfg'
                },
                abilities: {
                  wisdom: {
                    total: 1,
                    modifier: -5,
                    baseValue: 1,
                    raceBonus: 0,
                    savingThrows: false
                  },
                  charisma: {
                    total: 1, modifier: -5, baseValue: 1, raceBonus: 0, savingThrows: false
                  },
                  strength: {
                    total: 1, modifier: -5, baseValue: 1, raceBonus: 0, savingThrows: false
                  },
                  dexterity: {
                    total: 1, modifier: -5, baseValue: 1, raceBonus: 0, savingThrows: false
                  },
                  constitution: {
                    total: 1, modifier: -5, baseValue: 1, raceBonus: 0, savingThrows: false
                  },
                  intelligence: {
                    total: 1, modifier: -5, baseValue: 1, raceBonus: 0, savingThrows: false
                  }
                },
                proficiency: 2,
                primaryLevel: 1
              }
            }
          ])
            .returning('*')
        );
    });
};
