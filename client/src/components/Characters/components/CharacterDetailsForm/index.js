import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Form, Image, Segment } from 'semantic-ui-react';
import Yup from 'yup';

import GameLabelsSelect from '../../../Games/components/GameLabelsSelect';
import { uploadImage } from '../../../../services/image';
import FormFieldErrorMessage from '../../../../components/shared/components/FormFieldErrorMessage';

// label forms

import CharacterDetails5e_1_0_0 from '../CharacterLabelForms/1_CharacterDetails5e_1_0_0';
import CharacterDetailsPathFinder_1_0_0 from '../CharacterLabelForms/2_CharacterDetailsPathFinder_1_0_0';

import './CharacterDetailsForm.styl';

class CharacterDetailsForm extends Component {

  static propTypes = {
    renderActions: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    character: PropTypes.object,
    loading: PropTypes.bool
  };

  state = {
    file: null,
    profileImageUrl: null
  };

  render() {
    const { loading, character, renderActions, lockLabel } = this.props;
    // profileImageUrl is either off the character or the internal state if editing
    const profileImageUrl = _.get(this.state, 'profileImageUrl') || _.get(character, 'profileImage.url');

    return (
      <Formik
        enableReinitialize={true}
        initialValues={characterToValues(character) || validationSchema.default()}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
        render={({ values, dirty: dirtyMain, handleChange, setFieldValue, submitForm: submitFormMain, isValid: isValidMain, submitCount: submitCountMain }) => (
          <div className="character-detail-form">
            <Segment>
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
                    <FormFieldErrorMessage name="name"/>
                  </Form.Field>

                  <Form.Field required>
                    <label>Label</label>
                    <GameLabelsSelect
                      value={values.labelId}
                      disabled={lockLabel}
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
            </Segment>

            <LabelDetailForm
              labelId={values.labelId}
              characterDetails={_.get(character, 'characterDetails')}
              setFieldValue={setFieldValue}
              onSubmit={this._handleLabelSubmit}
              renderActions={({ submitForm: submitFormLabel, isValid: isValidLabel, dirty: dirtyLabel, submitCount: submitCountLabel }) => (
                renderActions({
                  submitForm: this._handleFormSubmits(submitFormLabel, submitFormMain),
                  isValid: isValidMain && isValidLabel,
                  isDirty: dirtyMain || dirtyLabel,
                  submitCount: submitCountMain + submitCountLabel
                })
              )}
            />
          </div>
        )}
      />
    );
  };

  _handleFormSubmits = (submitFormLabel, submitFormMain) => {
    // submitting two forms here. The Label first, which if is valid
    // will call this._handleLabelSubmit. We then call
    // this.submitFormMain to submit the main form
    // which sends the combined payload to the caller's onSubmit
    this.submitFormMain =  submitFormMain;

    return () => {
      // invoke the two form submits here to that each form is validated
      // to display any errors
      submitFormLabel();
      submitFormMain();
    };
  };

  _handleLabelSubmit = (labelDetailsPayload) => {
    this.labelDetailsPayload = labelDetailsPayload;
    this.submitFormMain();
  };

  _handleSubmit = (values, { setSubmitting, setErrors }) => {
    if (this.labelDetailsPayload) {
      const { file } = this.state;
      const { onSubmit } = this.props;

      setSubmitting(true);

      return uploadImage(file, 'characterProfile')
        .then((image) => {
          const payload = _.merge({}, {
            characterDetails: this.labelDetailsPayload
          }, values);

          if (image) {
            payload.profileImage = {
              publicId: _.get(image, 'publicId'),
              userUploadId: _.get(image, 'userUploadId'),
              url: _.get(image, 'imageUrl')
            };
          }

          setSubmitting(true);

          return onSubmit(payload);
        });
    }
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


}

export default CharacterDetailsForm;

function LabelDetailForm(props) {
  const { labelId, characterDetails, renderActions, onSubmit } = props;
  const LabelComponent = {
    1: CharacterDetails5e_1_0_0,
    2: CharacterDetailsPathFinder_1_0_0
  }[labelId] || null;

  if (LabelComponent) {
    return (
      <LabelComponent
        characterDetails={characterDetails}
        renderActions={renderActions}
        onSubmit={onSubmit}
      />
    );
  } else {
    return (
      <Segment inverted color='grey' tertiary>
        Please select a Game from the label list
      </Segment>
    );
  }

}

const validationSchema = Yup.object().shape({
  name: Yup.string().default('').max(128).min(3).required(),
  labelId: Yup.number().integer().default('').required()
});

function characterToValues(character) {
  return character && validationSchema.noUnknown().cast(character);
}
