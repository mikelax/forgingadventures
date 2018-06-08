import _ from 'lodash';
import Roll from 'roll';

import GameMessage from 'models/gameMessage';

export default class {
  constructor(options) {
    this.user = options.user;
    this.input = options.input;
  }

  execute() {
    const rolls = calculateDiceRolls.call(this);

    const payload = _.merge({}, this.input, {
      userId: this.user.id,
      meta: { rolls }
    });

    return GameMessage
      .query()
      .insert(payload)
      .returning('*')
      .execute();
  }
}

// private

function calculateDiceRolls() {
  const { input: { meta } } = this;
  const rolls = _.get(meta, 'rolls');

  return _.map(rolls, ({ label, input }) => {
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
