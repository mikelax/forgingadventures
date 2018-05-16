import _ from 'lodash';
import React from 'react';

export const primaryAttributes = (props) => {
  const { character: { characterDetails } } = props;

  return characterDetails && (
    <React.Fragment>
      <span className="primary-attributes">
        {_.capitalize(characterDetails.traits.race)}&nbsp;
        {_.capitalize(characterDetails.traits.primaryClass)} level {characterDetails.primaryLevel}
      </span>
    </React.Fragment>
  );
};

export const secondaryAttributes = (props) => {
  const { character: { characterDetails } } = props;

  if (characterDetails) {
    const attributes = [
      `HP ${characterDetails.health.currentHitPoints}/${characterDetails.health.maxHitPoints}`,
      'AC ??',
      'Init ??',
      'Perc ??'
    ];

    return (
      <div className="secondary-attributes">
        { _.map(attributes, (attr, idx) => <span className="attribute" key={`secondary-attribute-${idx}`}>{attr}</span>) }
      </div>
    );

  } else {
    return null;
  }

};
