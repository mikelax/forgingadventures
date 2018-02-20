import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Form } from 'semantic-ui-react';

import { gameLabelsQuery } from '../../queries';

class GameLabelsSelect extends Component {

  render() {
    const { data: { gameLabels }, value, error, placeholder, onChange } = this.props;

    return (
      <Form.Field
        as="select"
        error={error}
        value={value}
        onChange={onChange}>
          <option value="0">{ placeholder || 'Select a Label' }</option>
        {
          _.map(gameLabels, (gameLabel) =>
            <option key={gameLabel.id} value={gameLabel.id}>{gameLabel.displayName}</option>
          )
        }
      </Form.Field>
    );
  }

}

export default graphql(gameLabelsQuery)(GameLabelsSelect);
