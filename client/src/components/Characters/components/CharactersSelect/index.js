import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Form, Message } from 'semantic-ui-react';

import { availableCharactersQuery } from '../../queries';

class CharactersSelect extends Component {

  static propTypes = {
    error: PropTypes.bool.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { data: { availableCharacters }, value, error, placeholder, onChange } = this.props;

    return (
      <React.Fragment>
        <Form.Field
          control='select'
          error={error}
          label='Select an existing Character'
          value={value}
          onChange={onChange}>
            <option value="0">{ placeholder || 'Select a Character' }</option>
            {
              _.map(availableCharacters, (character) =>
                <option key={character.id} value={character.id}>{character.name}</option>
              )
            }
        </Form.Field>

        <Message info>
          <Message.List>
            <Message.Item>This list contains Characters matching the Game Type that aren't already in a Game.</Message.Item>
            <Message.Item>Don't worry, you can always Join now and create a new Character later.</Message.Item>
          </Message.List>
        </Message>
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  graphql(availableCharactersQuery, {
    options: ({ match: { params: { id } } }) => ({ variables: { gameId: id } })
  })
)(CharactersSelect);
