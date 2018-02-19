import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';
import { compose } from 'recompose';
import { connect } from 'react-redux';


import GameMessage from '../../components/GameMessage';

import { createGameMessageMutation } from '../../queries';

class CreateMessage extends Component {

  state = {
    hasContent: false
  };

  componentWillReceiveProps(nextProps) {
    const gameMessage = _.get(nextProps, 'gameMessage.message');

    if (gameMessage) {
      this.editor.addQuoteBlock(gameMessage);
    }
  }

  render() {
    return (
      <div className="create-message">
        <Form>
          <Form.Field>
            <label>Add Message</label>
            <GameMessage ref={(c) => (this.editor = c)} onChange={this._handleOnChange}/>
          </Form.Field>

          <Button primary onClick={this._submit} disabled={!(this.state.hasContent)}>Submit</Button>
        </Form>
      </div>
    );
  }

  _handleOnChange = (data) => {
    this.setState({ hasContent: data.hasContent });
  };

  _submit = () => {
    const { hasContent } = this.state;
    const { mutate } = this.props;

    hasContent && mutate({
      variables: {
        input: {
          gameId: this.props.gameId,
          message: this.editor.getEditorMessage()
        }
      }
    })
      .then(() => {
        this.editor.clear();
      });
  };
}

export default compose(
  graphql(createGameMessageMutation),
  connect(
    (state) => ({ gameMessage: state.gameMessage })
  )
)(CreateMessage);
