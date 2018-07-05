import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Popup, Menu, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import {
  primaryAttributes as dnd5PrimaryAttributes,
  secondaryAttributes as dnd5SecondaryAttributes
} from '../CharacterLabelGameMessageHeaders/1_5e';

import {
  primaryAttributes as pfPrimaryAttributes,
  secondaryAttributes as pfSecondaryAttributes
} from '../CharacterLabelGameMessageHeaders/2_pathFinder';

import { CharacterImageAvatar } from 'components/shared/ProfileImageAvatar';

import QuickEditCharacterModal from '../QuickEditCharacterModal';

import './InCharacterHeader.styl';

export default function InCharacterHeader(props) {
  const { characterDetails, character, character: { labelId  }, gameId, characterDetails: { meta: { version } } } = props;
  const { characterEditEnabled } = props;

  const PrimaryAttributes = {
    1: dnd5PrimaryAttributes,
    2: pfPrimaryAttributes
  }[labelId](version);

  const SecondaryAttributes = {
    1: dnd5SecondaryAttributes,
    2: pfSecondaryAttributes
  }[labelId](version);

  return (
    <Grid.Row columns={2} className="message-header">
      <Grid.Column computer={2} tablet={3} mobile={4}
                   textAlign="center"
                   verticalAlign="middle"
                   className="profile-image"
      >
        <InCharacterMenu
          enabled={characterEditEnabled}
          character={character}
          characterDetails={characterDetails}
          gameId={gameId}
        >
          <CharacterImageAvatar character={character} size="tiny" />
        </InCharacterMenu>
      </Grid.Column>

      <Grid.Column computer={14} tablet={13} mobile={12}
                   verticalAlign="middle">
        <Grid>
          <Grid.Row columns={1}>
            <Grid.Column className="character-name">
              {character.name}
            </Grid.Column>
            <Grid.Column>
              <PrimaryAttributes characterDetails={characterDetails}/>
            </Grid.Column>
            <Grid.Column>
              <SecondaryAttributes characterDetails={characterDetails}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid.Row>
  );
}

InCharacterHeader.propTypes = {
  characterDetails: PropTypes.object.isRequired,
  character: PropTypes.object.isRequired
};

class InCharacterMenu extends Component {

  state={
    quickEditingCharacter: false
  };

  render() {
    const { children, character, characterDetails, gameId, enabled } = this.props;
    const { quickEditingCharacter } = this.state;
    const open = (quickEditingCharacter || !(enabled)) ? { open: false } : {};
    const cx = classNames({ 'popup-trigger': enabled });

    return (
      <React.Fragment>
        <Popup
          trigger={<div className={cx}>{children}</div>}
          hideOnScroll
          position="right center"
          hoverable
          {...open}
        >
          <Menu vertical compact size="tiny">
            <Menu.Item onClick={this._showQuickEditModal}>
              <Icon icon="edit outline" />
              Quick Edit Character
            </Menu.Item>

            <Menu.Item as={NavLink} to={`/characters/${character.id}/edit`} target="_blank">
              <Icon icon="edit" />
              Edit Character
            </Menu.Item>
          </Menu>
        </Popup>

        { quickEditingCharacter && (
          <QuickEditCharacterModal
            open={quickEditingCharacter}
            character={character}
            characterDetails={characterDetails}
            gameId={gameId}
            onClose={this._closeQuickEdit}
            onCancel={this._closeQuickEdit}
          />
        ) }

      </React.Fragment>
    );
  }

  _showQuickEditModal = () => {
    this.setState({ quickEditingCharacter: true });
  };

  _closeQuickEdit = () => {
    this.setState({ quickEditingCharacter: false });
  };
}
