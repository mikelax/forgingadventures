import _ from 'lodash';
import React from 'react';

import { signedNumber } from 'services/format';

export const primaryAttributes = (props) => {
  const { character: { characterDetails } } = props;

  return characterDetails && (
    <div className="primary-attributes">
      {_.capitalize(characterDetails.traits.race)}&nbsp;
      {_.capitalize(characterDetails.traits.primaryClass)} level {characterDetails.primaryLevel}
    </div>
  );
};

export const secondaryAttributes = (props) => {
  const { character: { characterDetails } } = props;

  if (characterDetails) {
    const attributes = [
      `HP ${characterDetails.health.currentHitPoints}/${characterDetails.health.maxHitPoints}`,
      `AC ${characterDetails.ac}`,
      `Init ${initiative()}`
    ];

    return (
      <div className="secondary-attributes">
        { _.map(attributes, (attr, idx) => <span className="attribute" key={`secondary-attribute-${idx}`}>{attr}</span>) }
      </div>
    );

  } else {
    return null;
  }

  function initiative() {
    const result = _.get(characterDetails, 'abilities.dexterity.modifier');
    return signedNumber(result);
  }

};
