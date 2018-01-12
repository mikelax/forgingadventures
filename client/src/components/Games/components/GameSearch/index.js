import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, Form, FormControl, FormGroup, Panel} from 'react-bootstrap';
import {gameStatus, postingFrequencies, skillLevels} from "../../utils/gameSettings";

import './assets/GameSearch.styl';

export default class GameSearch extends Component {

  static propTypes = {
    onSearch: PropTypes.func.isRequired
  };

  state = {
    store: {
      gameSettings: {}
    }
  };

  render() {
    return <div className="GameSearch">
      <Panel>
        <Panel.Body>
          <Form onSubmit={this.search} className="search-form">
            <FormGroup className="text-search">
              <FormControl
                type="text"
                value={this.formValue('title')}
                onChange={this.formInput('title')}
                placeholder="Search"
              />
            </FormGroup>

            <FormGroup className="skill-level">
              <ControlLabel>Skill Level</ControlLabel>
              <FormControl
                value={this.formValue('gameSettings.skillLevel')}
                onChange={this.formInput('gameSettings.skillLevel')}
                componentClass="select">
                {
                  _.map(skillLevels, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </FormControl>
            </FormGroup>

            <FormGroup className="posting-frequency">
              <ControlLabel>Posting Frequency</ControlLabel>
              <FormControl
                value={this.formValue('gameSettings.postingFrequency')}
                onChange={this.formInput('gameSettings.postingFrequency')}
                componentClass="select">
                <option value={0}>Any</option>
                {
                  _.map(postingFrequencies, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </FormControl>
            </FormGroup>

            <FormGroup className="status">
              <ControlLabel>Status</ControlLabel>
              <FormControl
                value={this.formValue('gameSettings.gameStatus')}
                onChange={this.formInput('gameSettings.gameStatus')}
                componentClass="select">
                <option value={0}>Any</option>
                {
                  _.map(gameStatus, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </FormControl>
            </FormGroup>

            <div className="actions text-right">
              <Button className="btn btn-primary text-right" type="submit">
                Search
              </Button>
            </div>
          </Form>
        </Panel.Body>
      </Panel>
    </div>;
  }

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

  search = (e) => {
    e.preventDefault();
    this.props.onSearch(this.state.store);
  };

}

