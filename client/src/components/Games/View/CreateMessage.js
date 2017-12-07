import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

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
            <ControlLabel>Messages</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={this.state.message}
              placeholder="Enter Message"
              onChange={e => this.setState({ message: e.target.value })}
            />
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
            message: this.state.message
          }
        }
      })
      .then(() => this.setState({ message: '' }));
  }
};

export default graphql(createGameMessageMutation)(CreateGame);