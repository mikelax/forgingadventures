import React from 'react';
import { Grid } from 'semantic-ui-react';

import {
  primaryAttributes as dnd5PrimaryAttributes,
  secondaryAttributes as dnd5SecondaryAttributes
} from '../CharacterLabelGameMessageHeaders/1_5e';

import {
  primaryAttributes as pfPrimaryAttributes,
  secondaryAttributes as pfSecondaryAttributes
} from '../CharacterLabelGameMessageHeaders/2_pathFinder';

import { CharacterImageAvatar } from 'components/shared/components/ProfileImageAvatar';

import './InCharacterHeader.styl';

export default function(props) {
  const { character, character: { labelId } } = props;

  const PrimaryAttributes = {
    1: dnd5PrimaryAttributes,
    2: pfPrimaryAttributes
  }[labelId];
  const SecondaryAttributes = {
    1: dnd5SecondaryAttributes,
    2: pfSecondaryAttributes
  }[labelId];

  return (
    <Grid.Row columns={2} className="message-header">
      <Grid.Column computer={2} tablet={3} mobile={4}
                   textAlign="center"
                   verticalAlign="middle"
                   className="profile-image"
      >
        <CharacterImageAvatar character={character}/>
      </Grid.Column>

      <Grid.Column computer={14} tablet={13} mobile={12}
                   verticalAlign="middle">
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column className="character-name">
              {character.name}
            </Grid.Column>
            <Grid.Column>
              <PrimaryAttributes character={character}/>
            </Grid.Column>
            <Grid.Column>
              <SecondaryAttributes character={character}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid.Row>
  );
}
