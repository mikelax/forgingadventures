import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';

import GameMessage from '../../components/GameMessage';

import { createGameMessageMutation } from '../../queries';

class CreateMessage extends Component {

  state = {
    hasContent: false
  };

  render() {
    return (
      <div className="create-message">
        <form>
          <FormGroup>
            <ControlLabel>Add Message</ControlLabel>
            <GameMessage ref={(c) => (this.editor = c)} onChange={this._handeOnChange}/>
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this._submit} disabled={!(this.state.hasContent)}>Submit</Button>
      </div>
    );
  }

  _handeOnChange = (data) => {
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

export default graphql(createGameMessageMutation)(CreateMessage);