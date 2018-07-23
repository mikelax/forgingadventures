import { transaction } from 'objection';

import GameMessageReadIndicator from 'models/gameMessageReadIndicator';

export default function ({ user, gameId, gameMessageId }) {
  // a user can only have a single entry for each gameId and gameMessageId
  let trx;

  return transaction
    .start(GameMessageReadIndicator.knex())
    .then(t => (trx = t))
    .then(() => GameMessageReadIndicator.query(trx)
      .where({
        gameId,
        userId: user.id
      })
      .del())
    .then(() => GameMessageReadIndicator.query(trx)
      .insert({
        gameId,
        gameMessageId,
        userId: user.id
      })
      .returning('*')
      .first()
    )
    .tap(() => trx.commit())
    .tapCatch(() => trx.rollback());
}
