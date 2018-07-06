import _ from 'lodash';
import Bluebird from 'bluebird';
import { transaction } from 'objection';

import CharacterLog from 'models/characterLog';
import Character from 'models/character';

export default function({ user, input, engine }) {
  let character;
  let characterDetails;
  let characterLog;
  let trx;

  return Bluebird
    .resolve()
    .then(startTransaction)
    .then(validateCharacterDetails)
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

  function validateCharacterDetails() {
    const { characterDetails: characterDetailsInput } = input;

    return engine
      .validateCharacterDetails(characterDetailsInput)
      .then(cd => (characterDetails = cd));
  }

  function createCharacter() {
    const payload = _.merge({}, input, {
      characterDetails,
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
    const payload = {
      characterId: character.id,
      changeDescription: 'Character is born',
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
