import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Form, Image } from 'semantic-ui-react';

import GameLabelsSelect from '../../../Games/components/GameLabelsSelect';
import { uploadImage } from '../../../../services/image';
import Yup from 'yup';

// label forms

import CharacterDetails5e_1_0_0 from '../CharacterLabelForms/CharacterDetails5e_1_0_0';

import './CharacterDetailsForm.styl';

class CharacterDetailsForm extends Component {

  static propTypes = {
    renderActions: PropTypes.func.isRequired,
    character: PropTypes.object,
    loading: PropTypes.bool
  };

  state = {
    file: null,
    profileImageUrl: null
  };

  render() {
    const { profileImageUrl } = this.state;
    const { loading, character, renderActions } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        initialValues={characterToValues(character) || validationSchema.default()}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
        render={({ values, handleChange, setFieldValue, submitForm: submitFormMain, isValid: isValidMain }) => (
          <div className="character-detail-form">
            <Form as={FormikForm} loading={loading}>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Character Name</label>
                  <Form.Input
                    name="name"
                    value={values.name}
                    placeholder="Enter Character Name"
                    onChange={handleChange}
                  />
                </Form.Field>

                <Form.Field required>
                  <label>Label</label>
                  <GameLabelsSelect
                    value={values.labelId}
                    onChange={e => setFieldValue('labelId', e.target.value)}
                  />
                </Form.Field>
              </Form.Group>

              <Form.Field>
                <label>Profile Image</label>
                {
                  profileImageUrl ? (
                    <Image size='medium' src={profileImageUrl}/>
                  ) : null
                }
                <Form.Input
                  type="file"
                  placeholder="Select a Profile Image"
                  onChange={this._handleImage}
                />
              </Form.Field>
            </Form>

            <LabelDetailForm
              labelId={values.labelId}
              characterLabelDetails={null}
              setFieldValue={setFieldValue}
              renderActions={({ submitForm: submitFormLabel, isValid: isValidLabel }) => (
                renderActions({
                  submitForm: this._handleFormSubmits(submitFormLabel, submitFormMain),
                  isValid: isValidMain && isValidLabel
                })
              )}
            />
          </div>
        )}
      />
    );
  };

  _handleFormSubmits = (submitFormLabel, submitFormMain) => {

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

  _handleSubmit = (values, { setSubmitting, setErrors }) => {
    const { file } = this.state;
    const { onSave } = this.props;

    setSubmitting(true);

    return uploadImage(file, 'characterProfile')
      .then((image) => {
        const payload = _.merge({}, values);

        if (image) {
          payload.profileImage = {
            publicId: _.get(image, 'publicId'),
            userUploadId: _.get(image, 'userUploadId'),
            url: _.get(image, 'imageUrl')
          };
        }

        setSubmitting(true);

        return onSave(payload);
      });
  };

}

export default CharacterDetailsForm;

function LabelDetailForm(props) {
  const { labelId, characterLabelDetails, renderActions } = props;
  const LabelComponent = {
    1: CharacterDetails5e_1_0_0
  }[labelId] || null;

  return LabelComponent && (
    <LabelComponent
      characterLabelDetails={characterLabelDetails}
      renderActions={renderActions}
    />
  );
}

const validationSchema = Yup.object().shape({
  name: Yup.string().default('').max(128).min(3).required(),
  labelId: Yup.number().integer().default('').required()
});

function characterToValues(character) {
  return character && validationSchema.noUnknown().cast(character);
}
