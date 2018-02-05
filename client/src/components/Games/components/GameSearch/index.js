import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Segment, Button,  } from 'semantic-ui-react';

import { gameStatus, postingFrequencies, skillLevels } from "../../utils/gameSettings";


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
      <Segment>
        <Form onSubmit={this.search}>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Name or content</label>
              <Form.Input
                type="text"
                value={this.formValue('textSearch')}
                onChange={this.formInput('textSearch')}
                placeholder="Search"
              />
            </Form.Field>

            <Form.Field>
              <label>Skill Level</label>
              <Form.Field
                as="select"
                value={this.formValue('gameSettings.skillLevel')}
                onChange={this.formInput('gameSettings.skillLevel')}>
                <option value={0}>Any</option>
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
                value={this.formValue('gameSettings.postingFrequency')}
                onChange={this.formInput('gameSettings.postingFrequency')}>
                <option value={0}>Any</option>
                {
                  _.map(postingFrequencies, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </Form.Field>
            </Form.Field>

            <Form.Field>
              <label>Status</label>
              <Form.Field
                as="select"
                value={this.formValue('gameSettings.gameStatus')}
                onChange={this.formInput('gameSettings.gameStatus')}>
                <option value={0}>Any</option>
                {
                  _.map(gameStatus, (desc, level) =>
                    <option key={level} value={level}>{desc}</option>
                  )
                }
              </Form.Field>
            </Form.Field>

          </Form.Group>

          <div className="actions text-right">
            <Button primary type="submit">
              Search
            </Button>
          </div>
        </Form>
      </Segment>
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


