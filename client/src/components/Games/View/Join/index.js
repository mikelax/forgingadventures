import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { Button, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { createGamePlayerMutation } from '../../queries';

const JoinGame = class JoinGame extends Component {

  state = {
    store: {
      message: ''
    },
    errors: {}
  };

  render() {
    if (this.state.saved) {
      return <Redirect to="/games"/>;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Join the game on Forging Adventures</title>
        </Helmet>

        <div className="JoinGame">
          <h1>You're one step away from the Adventure</h1>

          <form>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Replace with Rich Editor</ControlLabel>
              <FormControl componentClass="textarea" placeholder="textarea" />
            </FormGroup>
          </form>

          <div className="actions text-right">
            <Button bsStyle="primary" onClick={this._submit}>Submit</Button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  _submit = () => {
    if (this._valid()) {
      this.props
        .mutate({
          variables: {
            input: {
              gameId: 10, // TODO change to props gameId
              status: 'pending'
            }
          }
        })
        .then(() => this.setState({ saved: true }));
    }
  };

  _valid = () => {
    return true;
  }
};

export default graphql(createGamePlayerMutation)(JoinGame);
