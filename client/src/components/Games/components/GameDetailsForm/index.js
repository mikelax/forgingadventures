import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { Button, Form, Image } from 'semantic-ui-react';

import { createGameMutation } from '../../queries';
import { skillLevels, postingFrequencies } from '../../utils/gameSettings';
import GameLabelsSelect from '../GameLabelsSelect';
import { uploadImage } from '../../../../services/image';
import RichEditor from '../../../shared/components/RichEditor';

class GameDetailsForm extends Component {

  static propTypes = {
    game: PropTypes.object,
    loading: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    // the form control state
    store: {
      title: '',
      scenario: '',
      overview: '',
      labelId: 0,
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

  componentWillMount() {
    const { game } = this.props;

    this._saveGameToState(game);
  }

  componentWillReceiveProps(nextProps) {
    const { game } = nextProps;

    this._saveGameToState(game);
  }

  render() {
    const { gameImageUrl } = this.state;
    const { loading, onCancel } = this.props;

    return (
      <React.Fragment>
        <Form loading={loading}>
          <Form.Group widths="equal">
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
              <label>Label</label>
              <GameLabelsSelect
                error={this._validity('labelId')}
                value={this._formValue('labelId')}
                onChange={this._formInput('labelId')}
              />
            </Form.Field>
          </Form.Group>

          <Form.Field required>
            <label className="top">Scenario</label>
            <Form.Input
              error={this._validity('scenario')}
              value={this._formValue('scenario')}
              placeholder="Enter Scenario"
              onChange={this._formInput('scenario')}
            />
          </Form.Field>

          <Form.Field required>
            <label className="top">Overview</label>
            <Form.Field
              as={RichEditor}
              error={this._validity('overview')}
              message={this._formValue('overview')}
              onChange={this._handleOverview}
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

          <Form.Field>
            <label>Game Image</label>
            {
              gameImageUrl ? (
                <Image size='huge' src={gameImageUrl} />
              ) : null
            }
            <Form.Input
              type="file"
              placeholder="Select a game image"
              onChange={this._handleImage}
            />
          </Form.Field>

          <div className="actions text-right">
            <Button primary onClick={this._submit} disabled={this.state.saving} loading={this.state.saving}>Submit</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </div>
        </Form>
      </React.Fragment>
    );
  };

  _saveGameToState(game) {
    if (game) {
      this.setState({
        store: {
          title: game.title,
          scenario: game.scenario,
          overview: game.overview,
          labelId: game.label.id,
          gameSettings: {
            minPlayers: game.gameSettings.minPlayers,
            maxPlayers: game.gameSettings.maxPlayers,
            skillLevel: game.gameSettings.skillLevel,
            postingFrequency: game.gameSettings.postingFrequency
          }
        },
        gameImageUrl: _.get(game, 'gameImage.url')
      });
    }
  }

  _valid = () => {
    const errors = {};

    errors.labelId = _.isEmpty(this._formValue('labelId'));
    errors.overview = _.isEmpty(this._formValue('overview'));
    errors.scenario = _.isEmpty(this._formValue('scenario'));
    errors.title = _.isEmpty(this._formValue('title'));

    this.setState({ errors });

    return _(errors).values().sumBy(v => v) === 0;
  };

  _validity = (field) => {
    return this.state.errors[field] === true;
  };

  _formInput = (stateKey) => {
    return (e) => {
      this.setState(prevState => {
        const { store } = prevState;
        _.set(store, stateKey, e.target.value);

        return { store };
      });
    };
  };

  _handleOverview = (message) => {
    this.setState(prevState => {
      const { store } = prevState;
      _.set(store, 'overview', message.content);

      return { store };
    });
  };

  _formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };

  _handleImage = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const gameImageUrl = reader.result;

      this.setState({ file, gameImageUrl });
    };

    reader.readAsDataURL(file);
  };

  _submit = () => {
    if (this._valid()) {
      const { file } = this.state;
      const { onSave } = this.props;

      this.setState({ saving: true });

      return uploadImage(file, 'gameImage')
        .then((gameImage) => {
          const payload = _.merge({}, this.state.store);

          if (gameImage) {
            payload.gameImage = {
              publicId: _.get(gameImage, 'publicId'),
              userUploadId: _.get(gameImage, 'userUploadId'),
              url: _.get(gameImage, 'imageUrl')
            };
          }

          this.setState({ saving: false });
          return onSave(payload);
        });
    }
  };
}

export default compose(
    graphql(createGameMutation),
    withRouter
  )(GameDetailsForm);
