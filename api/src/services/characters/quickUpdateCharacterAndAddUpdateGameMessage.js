import _ from 'lodash';
import Bluebird from 'bluebird';
import { transaction as knexTransaction } from 'objection';

import Character from 'models/character';

import CreateMessage from 'services/gameMessages/createGameMessage';
import updateCharacter from 'services/characters/updateCharacter';

import serviceExecutor from 'utils/serviceExecutor';


export default function ({
  id, user, input, engine
}) {
  let character;
  let gameMessage;
  let transaction;

  return Bluebird
    .resolve()
    .then(startTransaction)
    .then(doUpdateCharacter)
    .then(generateGameMessage)
    .then(commitTransaction)
    .then(() => ({ character, gameMessage }))
    .tapCatch(rollbackTransaction);

  // helpers

  function startTransaction() {
    return knexTransaction
      .start(Character.knex())
      .then(t => (transaction = t));
  }

  function doUpdateCharacter() {
    const cleanInput = _(input)
      .chain()
      .omit(['changeDescription', 'changeMeta'])
      .value();

    return updateCharacter({
      id, user, input: cleanInput, engine, transaction
    })
      .then(c => (character = c));
  }

  function generateGameMessage() {
    const { changeMeta, changeDescription } = input;

    const changeMessageContent = _(changeMeta)
      .chain()
      .map((change) => {
        return (`
          <div class="change-meta">
            <strong>${changeDescription || 'Changed'}</strong>: 
            changed ${change.attributeDescription} 
            from <span class="before">${change.oldValue} 
            to <span class="after">${change.newValue}</span></span>    
          </div> 
        `);
      })
      .join()
      .value();

    if (!(_.isEmpty(changeMessageContent))) {
      const { gameId } = changeMeta[0];

      return serviceExecutor(CreateMessage, {
        user,
        input: {
          gameId,
          postType: 'ic',
          characterId: character.id,
          message: changeMessageContent
        },
        transaction
      })
        .then(gm => (gameMessage = gm));
    }
  }

  function commitTransaction() {
    return transaction.commit();
  }

  function rollbackTransaction() {
    return transaction.rollback();
  }
}
