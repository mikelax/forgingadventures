import { transaction } from 'objection';

import CharacterLog from 'models/characterLog';
import Character from 'models/character';

export default function ({ id, user, input }) {
  let character;
  let characterLog;
  let previousCharacterLog;
  let trx;

  return startTransaction()
    .then(updateCharacter)
    .then(getPreviousCharacterLog)
    .then(saveCharacterLog)
    .then(updateLastCharacterLog)
    .then(commitTransaction)
    .tapCatch(rollbackTransaction)
    .then(() => character);

  // helpers

  function startTransaction() {
    return transaction
      .start(CharacterLog.knex())
      .then(t => (trx = t));
  }

  function updateCharacter() {
    // FIXME hook in yup validation here

    return Character
      .query(trx)
      .patch(input)
      .where({ id, userId: user.id })
      .first()
      .returning('*')
      .execute()
      .then(c => (character = c));
  }

  function getPreviousCharacterLog() {
    return CharacterLog
      .query(trx)
      .where({ characterId: character.id })
      .orderBy('createdAt', 'desc')
      .limit(1)
      .first()
      .then(pcl => (previousCharacterLog = pcl));
  }

  function saveCharacterLog() {
    const { characterDetails } = character;
    const { changeDescription } = input;

    const payload = {
      characterId: character.id,
      changeDescription: changeDescription || 'Character stats updated',
      previousCharacterLogId: previousCharacterLog.id,
      characterDetails
    };

    return CharacterLog
      .query(trx)
      .insert(payload)
      .returning('*')
      .execute()
      .then(cl => (characterLog = cl));
  }

  function updateLastCharacterLog() {
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
