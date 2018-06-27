import _ from 'lodash';
import React from 'react';

export default function PrimaryAttributes (props) {
  const { characterDetails } = props;

  return characterDetails && (
    <div className="primary-attributes">
      {_.capitalize(characterDetails.traits.race)}&nbsp;
      {_.capitalize(characterDetails.traits.primaryClass)} level {characterDetails.primaryLevel}
    </div>
  );
}
