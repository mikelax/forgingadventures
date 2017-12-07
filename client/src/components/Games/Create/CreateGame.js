import _ from 'lodash';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { createGameMutation, gamesQuery } from '../queries';

const CreateGame = class CreateGame extends Component {

  state = {
    // the form control state
    store: {
      title: '',
      scenario: '',
      overview: '',
      gameSettings: {
        minPlayers: 2,
        maxPlayers: 6,
        skillLevel: 1,
        postingFrequency: 1
      }
    },
    // the form validity state
    errors: {}
  };

  render() {
    if (this.state.saved) {
      return <Redirect to="/games"/>;
    }

    return (
      <div className="create">
        <h1>Create a New Campaign</h1>

        <form>
          <FormGroup validationState={this.validity('title')}>
            <ControlLabel>Campaign Name</ControlLabel>
            <FormControl
              type="text"
              value={this.formValue('title')}
              placeholder="Enter Campaign Name"
              onChange={this.formInput('title')}
            />
          </FormGroup>

          <FormGroup validationState={this.validity('scenario')}>
            <FormControl
              componentClass="textarea"
              value={this.formValue('scenario')}
              placeholder="Enter Scenario"
              onChange={this.formInput('scenario')}
            />
          </FormGroup>

          <FormGroup validationState={this.validity('overview')}>
            <FormControl
              componentClass="textarea"
              value={this.formValue('overview')}
              placeholder="Enter Overview"
              onChange={this.formInput('overview')}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Minimum Players</ControlLabel>
            <FormControl
              type="number"
              value={this.formValue('gameSettings.minPlayers')}
              placeholder="Minimum Players"
              onChange={this.formInput('gameSettings.minPlayers')}
            />
            <ControlLabel>Max Players</ControlLabel>
            <FormControl
              type="number"
              value={this.formValue('gameSettings.maxPlayers')}
              placeholder="Maximum Players"
              onChange={this.formInput('gameSettings.maxPlayers')}
            />
            
            <ControlLabel>Skill Level</ControlLabel>
            <FormControl
              componentClass="select"
              value={this.formValue('gameSettings.skillLevel')}
              onChange={this.formInput('gameSettings.skillLevel')}>
              <option value="1">Any/Newbie friendly</option>
              <option value="2">I’ve rolled dice before</option>
              <option value="3">Expert/role play master and rules bookworm</option>
            </FormControl>
            
            <ControlLabel>Frequence</ControlLabel>
            <FormControl
              componentClass="select"
              value={this.formValue('gameSettings.postingFrequency')}
              onChange={this.formInput('gameSettings.postingFrequency')}>
              <option value="1">About 1 / day</option>
              <option value="2">2-3 times / week</option>
              <option value="3">Hardcore - More than 1 / day</option>
            </FormControl>
          </FormGroup>
        </form>

        <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
      </div>
    );
  };

  submit = () => {
    if (this.valid()) {
      this.props
        .mutate({
          variables: {
            input: this.state.store
          },
          update: (store, { data: { createGame } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: gamesQuery });
            // Add our game from the mutation to the end.
            data.games.push(createGame);
            // Write our data back to the cache.
            store.writeQuery({ query: gamesQuery, data });
          }
        })
        .then(() => this.setState({ saved: true }));
    }
  };

  valid = () => {
    const errors = {};

    _.isEmpty(this.formValue('title')) && (errors.title = 'Title is required');
    _.isEmpty(this.formValue('scenario')) && (errors.scenario = 'Scenario is required');
    _.isEmpty(this.formValue('overview')) && (errors.overview = 'Overview is required');


    this.setState({...this.state, errors});

    return _.keys(errors).length === 0;
  };

  validity = (field) => {
    if (this.state.errors[field]) {
      return 'error';
    }
  };

  formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({...this.state, store});
    };
  };

  formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };
};

export default graphql(createGameMutation)(CreateGame);