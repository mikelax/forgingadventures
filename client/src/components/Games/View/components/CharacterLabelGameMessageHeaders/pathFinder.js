import _ from 'lodash';
import React from 'react';

export default (props) => {
  const { character, character: { characterDetails } } = props;

  return (
    <React.Fragment>
      <span className="name">{character.name}</span>&nbsp;
      <span className="attributes">
        (level {characterDetails.primaryLevel}&nbsp;
        {_.capitalize(characterDetails.traits.race)}&nbsp;
        {_.capitalize(characterDetails.traits.primaryClass)})
    </span>
    </React.Fragment>
  );
};
