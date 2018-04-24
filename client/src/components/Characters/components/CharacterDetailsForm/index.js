import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form, Image } from 'semantic-ui-react';

import GameLabelsSelect from '../../../Games/components/GameLabelsSelect';
import { uploadImage } from '../../../../services/image';

// label forms

import CharacterDetails5e_1_0_0 from '../CharacterLabelForms/CharacterDetails5e_1_0_0';

import './CharacterDetailsForm.styl';

class CharacterDetailsForm extends Component {

  static propTypes = {
    character: PropTypes.object,
    loading: PropTypes.bool
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
    const { loading } = this.props;

    return (
      <div className="character-detail-form">
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
        </Form>

        {this._renderLabelCharacterForm()}
      </div>
    );
  };

  valid() {

  }

  doSave() {
    //check validity of both forms
    //save both forms
  }

  doReset() {
    //reset both forms
  }

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

  _renderLabelCharacterForm = () => {
    const { store: { labelId } } = this.state;
    const LabelForm = {
      1: CharacterDetails5e_1_0_0
    }[labelId];

    return LabelForm && <LabelForm ref={(ref) => this.labelForm = ref} />;
  }
}

export default CharacterDetailsForm;
