import _ from 'lodash';
import { transaction } from 'objection';
import Bluebird from 'bluebird';
import Roll from 'roll';

import Character from 'models/character';
import GameMessage from 'models/gameMessage';

export default class {
  constructor(options) {
    this.user = options.user;
    this.input = options.input;

    this.trx = null;
    this.rolls = null;
    this.character = null;
  }

  execute() {
    return Bluebird
      .bind(this)
      .then(startTransaction)
      .then(calculateDiceRolls)
      .then(getLatestCharacterLog)
      .then(createGameMessage)
      .tap(() => this.trx.commit())
      .tapCatch(() => this.trx.rollback());
  }
}

// private

function startTransaction() {
  return transaction
    .start(Character.knex())
    .then(t => (this.trx = t));
}

function getLatestCharacterLog() {
  const { characterId } = this.input;

  return Character
    .query(this.trx)
    .findById(characterId)
    .then(character => (this.character = character));
}

function createGameMessage() {
  const { gameId, message, postType } = this.input;

  const payload = {
    gameId,
    userId: this.user.id,
    message,
    postType,
    meta: { rolls: this.rolls }
  };

  if (postType === 'ic') {
    const { lastCharacterLogId, id: characterId } = this.character;

    payload.characterId = characterId;
    payload.characterLogId = lastCharacterLogId;
  }

  return GameMessage
    .query(this.trx)
    .insert(payload)
    .returning('*')
    .execute();
}

function calculateDiceRolls() {
  const { input: { meta } } = this;
  const rolls = _.get(meta, 'rolls');

  this.rolls = _.map(rolls, ({ label, input }) => {
    return {
      label,
      input,
      result: calculateRoll(input)
    };
  });

  function calculateRoll(input) {
    const roll = new Roll();

    return roll.roll(input);
  }
}
