import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, ControlLabel, FormGroup } from 'react-bootstrap';

import GameMessage from '../components/GameMessage/GameMessage';

import { createGameMessageMutation } from '../queries';

const CreateGame = class CreateGame extends Component {

  state = {
    message: null
  };

  render() {
    return (
      <div className="create-message">
        <form>
          <FormGroup>
            <ControlLabel>Add Message</ControlLabel>
            <GameMessage ref={(c) => (this.editor = c)} onChanged={this.setMessage} />
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
      </div>
    );
  }

  setMessage = ({message}) => this.setState({message});

  submit = () => {
    this.props
      .mutate({
        variables: {
          input: {
            gameId: this.props.gameId,
            message: this.state.message
          }
        }
      })
      .then(() => {
        this.setState({ message: null });
        this.editor.clear();
      });
  }
};

export default graphql(createGameMessageMutation)(CreateGame);