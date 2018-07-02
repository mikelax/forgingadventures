import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { Icon, Modal, Button, Header, Form } from 'semantic-ui-react';
import { Formik, Form as FormikForm, Field } from 'formik';
import Yup from 'yup';

import { characterQuery, updateCharacterMutation } from 'components/Characters/queries';
import FormFieldErrorMessage from 'components/shared/FormFieldErrorMessage';
import { stripStoreVars } from 'services/apollo';

import './quickEditCharacterModal.styl';

export default function QuickEditCharacterModal(props) {
  const { character, open, gameId, onClose, onCancel } = props;

  return (
    <Query
      query={characterQuery}
      variables={{ id: character.id }}
    >
      {({ data, loading }) => (
        <Mutation
          mutation={updateCharacterMutation}
        >
          {updateCharacter => (
            <Formik
              enableReinitialize={true}
              initialValues={characterToValues(data.character)}
              onSubmit={handleSubmit(updateCharacter, data.character)}
              validationSchema={validationSchema}
              render={(formik) => (
                <Modal
                  size="mini"
                  open={open}
                  className="quick-char-edit"
                  onClose={handleClose}
                >
                  <Header icon='user circle outline' content='Quick Character Edit' />

                  <QuickEditCharacterForm
                    formik={formik}
                    character={data.character}
                    loading={loading}
                    onCancel={onCancel}
                  />

                </Modal>
              )}
            />
          )}
        </Mutation>
      )}
    </Query>
  );

  function handleClose() {
    onCancel();
  }

  function handleSubmit(updateCharacter, character) {
    return (values, { setSubmitting }) => {
      const { changeDescription } = values;

      const characterDetails = _.merge({}, character.characterDetails, {
        health: {
          ...character.characterDetails.health,
          ...values.health
        }
      });

      const changeMeta = calculateChangeMeta(character, values);

      const payload = {
        changeDescription,
        characterDetails,
        changeMeta,
        name: character.name,
        labelId: character.labelId,
        profileImage: stripStoreVars(character.profileImage)
      };

      setSubmitting(true);

      return updateCharacter({
        variables: {
          id: character.id,
          input: payload
        }
      })
        .then(() => onClose())
        .catch(() => setSubmitting(false));

    };
  }

  function calculateChangeMeta(character, values) {
    const changeFields = [
      {
        attributeKey: 'health.currentHitPoints',
        attributeDescription: 'Hit Points'
      }
    ];

    return _(changeFields)
      .chain()
      .map((field) => { // eslint-disable-line
        const oldValue = _.get(character, `characterDetails.${field.attributeKey}`);
        const newValue = _.get(values, field.attributeKey);

        if (oldValue !== newValue) {
          return {
            ...field,
            oldValue,
            newValue,
            gameId
          };
        }
      })
      .compact()
      .value();
  }
}

QuickEditCharacterModal.propTypes = {
  character: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const validationSchema = Yup.object().shape({
  changeDescription: Yup.string().default('').nullable(),
  health: Yup.object().shape({
    currentHitPoints: Yup.number().integer().default('').required(),
    maxHitPoints: Yup.number().integer().default('').min(1).required(),
    hitDie: Yup.string().default('').label('hit die').required()
  })
});

function characterToValues(character) {
  const characterDetails = _.get(character, 'characterDetails');

  return validationSchema.noUnknown().cast(characterDetails);
}

function QuickEditCharacterForm(props) {
  const { formik: { values, isSubmitting, submitForm }, loading, onCancel } = props;

  return (
    <Form as={FormikForm} loading={loading}>
      <Modal.Content>
        <Form.Group inline>
          <Form.Field>
            <label>Hit Points</label>

            <Field
              name="health.currentHitPoints"
              type="number"
              min="0"
              placeholder="Hit Points"
            />
            &nbsp;/&nbsp;
            <span className="max">
              {values.health.maxHitPoints}
            </span>
          </Form.Field>
          <FormFieldErrorMessage name="health.currentHitPoints" />
        </Form.Group>

        <div className="hit-die">
          Hit Die: {values.health.hitDie}
        </div>

        <Form.Field>
          <label>Change Description</label>
          <Field
            name="changeDescription"
            placeholder="Add change description"
          />
        </Form.Field>
      </Modal.Content>

      <Modal.Actions>
        <Button
          type="submit"
          color='green'
          loading={isSubmitting}
          inverted
          onClick={submitForm}
        >
          <Icon name='checkmark' /> Update Character
        </Button>

        <Button onClick={onCancel} disabled={isSubmitting}>
          <Icon name='cancel' /> Cancel
        </Button>
      </Modal.Actions>

    </Form>
  );
}
