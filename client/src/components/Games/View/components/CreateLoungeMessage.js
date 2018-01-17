import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Button, ControlLabel, FormGroup} from 'react-bootstrap';

import GameLoungeMessage from '../../components/GameLoungeMessage/index';

import {createGameLoungeMessageMutation} from '../../queries';

class CreateGameLoungeMessage extends Component {

  render() {
    return (
      <div className="create-message">
        <form>
          <FormGroup>
            <ControlLabel>Add Message</ControlLabel>
            <GameLoungeMessage ref={(c) => (this.editor = c)}/>
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this._submit}>Submit</Button>
      </div>
    );
  }

  _submit = () => {
    const {mutate} = this.props;

    mutate({
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

export default graphql(createGameLoungeMessageMutation)(CreateGameLoungeMessage);