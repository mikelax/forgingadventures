import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import Select from 'react-select';
import { compose } from 'recompose';
import { Form, Image, Item, Label, Message } from 'semantic-ui-react';

import { availableCharactersQuery } from 'components/Characters/queries';
import { getFullImageUrl } from 'services/image';

class CharactersSelect extends React.Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    value: PropTypes.PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { data: { availableCharacters }, value, onChange } = this.props;

    const options = _.map(availableCharacters, (character) => {
      const publicId = _.get(character, 'profileImage.publicId');
      return {
        value: character.id,
        label: character.name,
        profileImageUrl: getFullImageUrl(publicId, 'profileImage')
      };
    });

    return (
      <React.Fragment>
        <Form.Field>
          <label>Select an existing Character</label>
          <Select
            value={value}
            options={options}
            onChange={onChange}
            optionRenderer={this._renderOption}
            valueRenderer={this._renderValue}
          />
        </Form.Field>

        <Message info>
          <Message.List>
            <Message.Item>This list contains Characters matching the Game Type that aren't already in a Game.</Message.Item>
            <Message.Item>Don't worry, you can always Join now and create a new Character later.</Message.Item>
          </Message.List>
        </Message>
      </React.Fragment>
    );
  };

  _renderValue = (option) => {
    return (
      <Label as='a'>
        <Image avatar size='mini' src={option.profileImageUrl} />
        {option.label}
      </Label>
    );
  };

  _renderOption = (option) => {
    return (
      <Item.Group>
      <Item>
        <Item.Image avatar size='mini' src={option.profileImageUrl} />
        <Item.Content verticalAlign='middle'>
          <Item.Header as='a'>{option.label}</Item.Header>
        </Item.Content>
      </Item>
      </Item.Group>
    );
  }
}

export default compose(
  withRouter,
  graphql(availableCharactersQuery, {
    options: ({ match: { params: { id } } }) => ({ variables: { gameId: id } })
  })
)(CharactersSelect);
