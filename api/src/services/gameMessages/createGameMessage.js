import _ from 'lodash';
import { transaction } from 'objection';
import Bluebird from 'bluebird';
import Roll from 'roll';

import Character from 'models/character';
import Game from 'models/game';
import GameMessage from 'models/gameMessage';
import GamePlayer from 'models/gamePlayer';

import sanitiseHtml from 'utils/sanitiseHtml';
import { gameMessageMetaValidation } from 'engine';

export default class {
  constructor(options) {
    this.user = options.user;
    this.input = options.input;
    this.inCharacterPost = _.includes(['ic', 'icm'], options.input.postType);
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
      .then(checkIfUserIsInGame)
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
  if (this.trx) {
    this.externalTransaction = true;
  } else {
    return transaction
      .start(Character.knex())
      .then(t => (this.trx = t));
  }
}

function getGame() {
  return Game
    .query(this.trx)
    .findById(this.gameId)
    .then(game => (this.game = game));
}

function checkIfUserIsInGame() {
  return GamePlayer
    .query(this.trx)
    .count('id')
    .where({
      gameId: this.gameId,
      userId: this.user.id
    })
    .whereIn('status', ['accepted', 'game-master'])
    .first()
    .then(({ count }) => {
      if (!(count > 0)) {
        throw new Error('Must be member of game to post');
      }
    });
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
    message: sanitiseHtml(message),
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
