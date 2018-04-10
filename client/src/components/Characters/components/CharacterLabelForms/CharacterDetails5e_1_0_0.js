import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Form } from 'semantic-ui-react';


export default class CharacterDetails5e_1_0_0 extends Component {

  render() {
    const { characterLabelDetails, loading } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        initialValues={characterToValues(characterLabelDetails) || initialValues}
        onSubmit={handleSubmit.bind(null, this.props)}
        validationSchema={validationSchema}
        render={({ values, handleChange, handleReset, handleSubmit, isSubmitting }) => (
          <Form className="character-details" action={handleSubmit} loading={loading} >
            <h2>Custom Character Settings</h2>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Race</label>
                <Field
                  name="race"
                />
              </Form.Field>

              <Form.Field required>
                <label>Alignment</label>
              </Form.Field>

              <Form.Field required>
                <label>XP</label>
              </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Primary Class</label>
              </Form.Field>

              <Form.Field required>
                <label>Level</label>
              </Form.Field>

              <Form.Field required>
                <label>Proficiency</label>
              </Form.Field>
            </Form.Group>

            <h3>Health</h3>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Current</label>
              </Form.Field>

              <Form.Field required>
                <label>Max</label>
              </Form.Field>

              <Form.Field required>
                <label>Hit Die</label>
              </Form.Field>
            </Form.Group>

            <h3>Background and Traits</h3>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Background</label>
              </Form.Field>

              <Form.Field required>
                <label>Sex</label>
              </Form.Field>
            </Form.Group>

            <Form.Group>
              <Form.Field required>
                <label>Physical Characteristics</label>
              </Form.Field>
              <Form.Field required>
                <label>Features and Traits</label>
              </Form.Field>
            </Form.Group>

            <h3>Abilities</h3>

          </Form>
        )}
      />
    );
  }

}
