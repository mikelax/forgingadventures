import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, ControlLabel, Form, FormControl, FormGroup, Panel} from 'react-bootstrap';
import {gameStatus, postingFrequencies, skillLevels} from "../../utils/gameSettings";

import './assets/GameSearch.styl';

class GameSearch extends Component {

  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    gamesSearch: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.setState(this.props.gamesSearch);
  }

  render() {
    return <div className="GameSearch">
      <Panel>
        <Panel.Body>
          <Form onSubmit={this.search} className="search-form">
            <FormGroup className="text-search">
              <FormControl
                type="text"
                value={this.formValue('textSearch')}
                onChange={this.formInput('textSearch')}
                placeholder="Search"
              />
            </FormGroup>

            <FormGroup className="skill-level">
              <ControlLabel>Skill Level</ControlLabel>
              <FormControl
                value={this.formValue('gameSettings.skillLevel')}
                onChange={this.formInput('gameSettings.skillLevel')}
                componentClass="select">
                <option value={0}>Any</option>
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
      const state = _.merge({}, this.state);

      this.setState(_.set(state, stateKey, e.target.value));
    };
  };

  formValue = (stateKey) => {
    return _.get(this.state, stateKey, '');
  };

  search = (e) => {
    e.preventDefault();
    this.props.onSearch(this.state);
  };

}

const mapStateToProps = state => ({
  gamesSearch: state.gamesSearch
});

export default connect(
  mapStateToProps
)(GameSearch);


