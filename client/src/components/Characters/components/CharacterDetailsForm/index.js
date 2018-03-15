import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form, Image } from 'semantic-ui-react';

import GameLabelsSelect from '../../../Games/components/GameLabelsSelect';
import { uploadImage } from '../../../../services/image';

class CharacterDetailsForm extends Component {

  static propTypes = {
    character: PropTypes.object,
    loading: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    store: {
      name: '',
      labelId: 0
    },
    errors: {}
  };

  componentWillMount() {
    const { character } = this.props;

    this._saveGameToState(character);
  }

  componentWillReceiveProps(nextProps) {
    const { character } = nextProps;

    this._saveGameToState(character);
  }

  render() {
    const { profileImageUrl } = this.state;
    const { loading, onCancel } = this.props;

    return (
      <React.Fragment>
        <Form loading={loading}>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>Character Name</label>
              <Form.Input
                error={this._validity('name')}
                value={this._formValue('name')}
                placeholder="Enter Character Name"
                onChange={this._formInput('name')}
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

          <Form.Field>
            <label>Profile Image</label>
            {
              profileImageUrl ? (
                <Image size='medium' src={profileImageUrl} />
              ) : null
            }
            <Form.Input
              type="file"
              placeholder="Select a Profile Image"
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

  _saveGameToState(character) {
    if (character) {
      this.setState({
        store: {
          name: character.name,
          labelId: character.label.id
        },
        profileImageUrl: _.get(character, 'profileImage.url')
      });
    }
  }

  _valid = () => {
    const errors = {};

    errors.labelId = _.isEmpty(this._formValue('labelId'));
    errors.name = _.isEmpty(this._formValue('name'));

    this.setState({ errors });

    return _(errors).values().sumBy(v => v) === 0;
  };

  _validity = (field) => {
    return this.state.errors[field] === true;
  };

  _formInput = (stateKey) => {
    return (e) => {
      const { store } = this.state;

      _.set(store, stateKey, e.target.value);
      this.setState({ ...this.state, store });
    };
  };

  _formValue = (stateKey) => {
    return _.get(this.state.store, stateKey, '');
  };

  _handleImage = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      const profileImageUrl = reader.result;

      this.setState({ file, profileImageUrl });
    };

    reader.readAsDataURL(file);
  };

  _submit = () => {
    if (this._valid()) {
      const { file } = this.state;
      const { onSave } = this.props;

      this.setState({ saving: true });

      return uploadImage(file, 'characterProfile')
        .then((image) => {
          const payload = _.merge({}, this.state.store);

          if (image) {
            payload.profileImage = {
              publicId: _.get(image, 'publicId'),
              userUploadId: _.get(image, 'userUploadId'),
              url: _.get(image, 'imageUrl')
            };
          }

          this.setState({ saving: false });
          return onSave(payload);
        });
    }
  };
}

export default CharacterDetailsForm;