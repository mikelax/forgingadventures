import _ from 'lodash';
import { transaction } from 'objection';

import CharacterLog from 'models/characterLog';
import Character from 'models/character';

export default function({ user, input }) {
  let character;
  let characterLog;
  let trx;

  return startTransaction()
    .then(createCharacter)
    .then(createCharacterLog)
    .then(setLastCharacterLogId)
    .then(commitTransaction)
    .tapCatch(rollbackTransaction)
    .then(() => character);

  // helpers

  function startTransaction() {
    return transaction
      .start(CharacterLog.knex())
      .then(t => (trx = t));
  }

  function createCharacter() {
    // FIXME hook in yup validation here
    const payload = _.merge({}, input, {
      userId: user.id
    });

    return Character
      .query(trx)
      .insert(payload)
      .returning('*')
      .execute()
      .then(c => (character = c));
  }

  function createCharacterLog() {
    const { characterDetails } = character;

    const payload = {
      characterId: character.id,
      changeDescription: 'Character is are born',
      characterDetails
    };

    return CharacterLog
      .query(trx)
      .insert(payload)
      .returning('*')
      .execute()
      .then(cl => (characterLog = cl));
  }

  function setLastCharacterLogId() {
    return Character
      .query(trx)
      .patch({
        lastCharacterLogId: characterLog.id
      })
      .where({
        id: character.id
      })
      .first()
      .returning('*')
      .execute()
      .then(c => (character = c));
  }

  function commitTransaction() {
    return trx.commit();
  }

  function rollbackTransaction() {
    return trx.rollback();
  }
}
