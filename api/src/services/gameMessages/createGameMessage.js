import _ from 'lodash';
import { transaction } from 'objection';
import Bluebird from 'bluebird';
import Roll from 'roll';

import Character from 'models/character';
import Game from 'models/game';
import GameMessage from 'models/gameMessage';
import { gameMessageMetaValidation } from 'engine';

export default class {
  constructor(options) {
    this.user = options.user;
    this.input = options.input;
    this.inCharacterPost = options.input.postType === 'ic';
    this.gameId = options.input.gameId;

    this.trx = options.transaction;
    this.game = null;
    this.meta = null;
    this.rolls = null;
    this.character = null;
  }

  execute() {
    return Bluebird
      .bind(this)
      .then(startTransaction)
      .then(getGame)
      .then(getLatestCharacterLog)
      .then(validateGameMessageMeta)
      .then(calculateDiceRolls)
      .then(createGameMessage)
      .tap(commit)
      .tapCatch(rollback);
  }
}

// private

function startTransaction() {
  if (!(this.trx)) {
    this.externalTransaction = true;

    return transaction
      .start(Character.knex())
      .then(t => (this.trx = t));
  }
}

function getGame() {
  return Game
    .query()
    .findById(this.gameId)
    .then(game => (this.game = game));
}

function getLatestCharacterLog() {
  if (this.inCharacterPost) {
    const { characterId } = this.input;

    return Character
      .query(this.trx)
      .findById(characterId)
      .then(character => (this.character = character));
  }
}

function validateGameMessageMeta() {
  const { labelId } = this.game;
  const { meta } = this.input;

  return gameMessageMetaValidation({ labelId, meta })
    .then(m => (this.meta = m));
}

function calculateDiceRolls() {
  const { meta } = this;
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

function createGameMessage() {
  const { gameId, message, postType } = this.input;

  const payload = {
    gameId,
    userId: this.user.id,
    message,
    postType,
    meta: { rolls: this.rolls }
  };

  if (this.inCharacterPost) {
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

function commit() {
  if (!(this.externalTransaction)) {
    return this.trx.commit();
  }
}

function rollback() {
  if (!(this.externalTransaction)) {
    return this.trx.rollback();
  }
}
