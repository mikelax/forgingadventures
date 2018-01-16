import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';

import GameMessage from '../../components/GameMessage/index';

import { createGameMessageMutation } from '../../queries';

class CreateGame extends Component {

  render() {
    return (
      <div className="create-message">
        <form>
          <FormGroup>
            <ControlLabel>Add Message</ControlLabel>
            <GameMessage ref={(c) => (this.editor = c)} />
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
      </div>
    );
  }

  submit = () => {
    this.props
      .mutate({
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
  }
}

export default graphql(createGameMessageMutation)(CreateGame);