import _ from 'lodash';
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import {Helmet} from "react-helmet";
import {Redirect} from 'react-router-dom';

import {skillLevels, postingFrequencies} from '../utils/gameSettings';
import {createGameMutation, gamesQuery} from '../queries';
import './CreateGame.styl';

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
      <React.Fragment>
        <Helmet>
          <title>Create new Game on Forging Adventures</title>
        </Helmet>

        <div className="CreateGame">

          <h1>Create a New Game</h1>

          <form>
            <FormGroup validationState={this._validity('title')}>
              <ControlLabel>Campaign Name</ControlLabel>
              <FormControl
                type="text"
                value={this._formValue('title')}
                placeholder="Enter Campaign Name"
                onChange={this._formInput('title')}
              />
            </FormGroup>

            <FormGroup validationState={this._validity('scenario')}>
              <ControlLabel className="top">Scenario</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={this._formValue('scenario')}
                placeholder="Enter Scenario"
                onChange={this._formInput('scenario')}
              />
            </FormGroup>

            <FormGroup validationState={this._validity('overview')}>
              <ControlLabel className="top">Overview</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={this._formValue('overview')}
                placeholder="Enter Overview"
                onChange={this._formInput('overview')}
              />
            </FormGroup>

            <FormGroup className="options">
              <ControlLabel>Minimum Players</ControlLabel>
              <FormControl
                type="number"
                placeholder="Minimum Players"
                value={this._formValue('gameSettings.minPlayers')}
                onChange={this._formInput('gameSettings.minPlayers')}
              />

              <ControlLabel>Max Players</ControlLabel>
              <FormControl
                type="number"
                value={this._formValue('gameSettings.maxPlayers')}
                placeholder="Maximum Players"
                onChange={this._formInput('gameSettings.maxPlayers')}
              />

              <ControlLabel>Skill Level</ControlLabel>
              <FormControl
                componentClass="select"
                value={this._formValue('gameSettings.skillLevel')}
                onChange={this._formInput('gameSettings.skillLevel')}>
                {
                  _.map(skillLevels, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </FormControl>


              <ControlLabel>Posting Frequency</ControlLabel>
              <FormControl
                componentClass="select"
                value={this._formValue('gameSettings.postingFrequency')}
                onChange={this._formInput('gameSettings.postingFrequency')}>
                {
                  _.map(postingFrequencies, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </FormControl>
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
            input: this.state.store
          },
          refetchQueries: [{
            query: gamesQuery,
            variables: {offset: 0}
          }]
        })
        .then(() => this.setState({ saved: true }));
    }
  };

  _valid = () => {
    const errors = {};

    _.isEmpty(this._formValue('title')) && (errors.title = 'Title is required');
    _.isEmpty(this._formValue('scenario')) && (errors.scenario = 'Scenario is required');
    _.isEmpty(this._formValue('overview')) && (errors.overview = 'Overview is required');


    this.setState({...this.state, errors});

    return _.keys(errors).length === 0;
  };

  _validity = (field) => {
    if (this.state.errors[field]) {
      return 'error';
    }
  };

  _formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({...this.state, store});
    };
  };

  _formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };
};

export default graphql(createGameMutation)(CreateGame);
