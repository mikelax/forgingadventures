import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Form } from 'semantic-ui-react';

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
      <Form.Field
        as="select"
        error={error}
        value={value}
        onChange={onChange}>
          <option value="0">{ placeholder || 'Select a Character' }</option>
        {
          _.map(availableCharacters, (character) =>
            <option key={character.id} value={character.id}>{character.name}</option>
          )
        }
      </Form.Field>
    );
  }
}

export default compose(
  withRouter,
  graphql(availableCharactersQuery, {
    options: ({ match: { params: { id } } }) => ({ variables: { gameId: id } })
  })
)(CharactersSelect);
