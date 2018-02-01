import _ from 'lodash';
import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';
import {Helmet} from "react-helmet";
import {Redirect} from 'react-router-dom';

import {skillLevels, postingFrequencies} from '../utils/gameSettings';
import {createGameMutation, gamesQuery} from '../queries';

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

          <Form>
            <Form.Field required>
              <label>Campaign Name</label>
              <Form.Input
                error={this._validity('title')}
                value={this._formValue('title')}
                placeholder="Enter Campaign Name"
                onChange={this._formInput('title')}
              />
            </Form.Field>

            <Form.Field required>
              <label className="top">Scenario</label>
              <Form.TextArea
                error={this._validity('scenario')}
                value={this._formValue('scenario')}
                placeholder="Enter Scenario"
                onChange={this._formInput('scenario')}
              />
            </Form.Field>

            <Form.Field required>
              <label className="top">Overview</label>
              <Form.TextArea
                error={this._validity('overview')}
                value={this._formValue('overview')}
                placeholder="Enter Overview"
                onChange={this._formInput('overview')}
              />
            </Form.Field>

            <Form.Group widths="equal">
              <Form.Field>
                <label>Minimum Players</label>
                <Form.Input
                  type="number"
                  placeholder="Minimum Players"
                  value={this._formValue('gameSettings.minPlayers')}
                  onChange={this._formInput('gameSettings.minPlayers')}
                />
              </Form.Field>

              <Form.Field>
                <label>Max Players</label>
                <Form.Input
                  type="number"
                  value={this._formValue('gameSettings.maxPlayers')}
                  placeholder="Maximum Players"
                  onChange={this._formInput('gameSettings.maxPlayers')}
                />
              </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field>
                <label>Skill Level</label>
                <Form.Field
                  as="select"
                  value={this._formValue('gameSettings.skillLevel')}
                  onChange={this._formInput('gameSettings.skillLevel')}>
                  {
                    _.map(skillLevels, (desc, level) =>
                      <option key={level} value={level}>{desc}</option>
                    )
                  }
                </Form.Field>
              </Form.Field>

              <Form.Field>
                <label>Posting Frequency</label>
                <Form.Field
                  as="select"
                  value={this._formValue('gameSettings.postingFrequency')}
                  onChange={this._formInput('gameSettings.postingFrequency')}>
                  {
                    _.map(postingFrequencies, (desc, level) =>
                      <option key={level} value={level}>{desc}</option>
                    )
                  }
                </Form.Field>
              </Form.Field>

            </Form.Group>

            <div className="actions text-right">
              <Button primary onClick={this._submit}>Submit</Button>
            </div>
          </Form>

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

    errors.title = _.isEmpty(this._formValue('title'));
    errors.scenario = _.isEmpty(this._formValue('scenario'));
    errors.overview = _.isEmpty(this._formValue('overview'));

    this.setState({errors});

    return _(errors).values().sumBy(v => v) === 0;
  };

  _validity = (field) => {
    return this.state.errors[field] === true;
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
