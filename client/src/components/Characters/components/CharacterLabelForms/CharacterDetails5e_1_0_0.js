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
                  component="select"
                >
                  <option value="dwarf">Dwarf</option>
                  <option value="elf">Elf</option>
                  <option value="halfling">Halfling</option>
                  <option value="human">Human</option>
                  <option value="dragonborn">Dragonborn</option>
                  <option value="gnome">Gnome</option>
                  <option value="halfelf">Half-Elf</option>
                  <option value="halforc">Half-Orc</option>
                  <option value="tiefling">Tiefling</option>
                </Field>
              </Form.Field>

              <Form.Field required>
                <label>Alignment</label>
                <Field
                  name="alignment"
                  component="select"
                >
                  <option value="lg">Lawful good</option>
                  <option value="ng">Neutral good</option>
                  <option value="cg">Chaotic good</option>
                  <option value="ln">Lawful neutral</option>
                  <option value="n">Neutral</option>
                  <option value="cn">Chaotic neutral</option>
                  <option value="le">Lawful evil</option>
                  <option value="ne">Neutral evil</option>
                  <option value="ce">Chaotic evil</option>
                </Field>
              </Form.Field>

              <Form.Field required label="XP" name="xp" control={Field} type="number" min="0" />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Primary Class</label>
                <Field
                  name="primaryClass"
                  component="select"
                >
                  <option value="barbarian">Barbarian</option>
                  <option value="bard">Bard</option>
                  <option value="cleric">Cleric</option>
                  <option value="druid">Druid</option>
                  <option value="fighter">Fighter</option>
                  <option value="monk">Monk</option>
                  <option value="paladin">Paladin</option>
                  <option value="ranger">Ranger</option>
                  <option value="rogue">Rogue</option>
                  <option value="sorcerer">Sorcerer</option>
                  <option value="warlock">Warlock</option>
                  <option value="wizard">Wizard</option>
                </Field>
              </Form.Field>

              <Form.Field required label="Level" name="level" control={Field} type="number" min="1" max="20" />

              <Form.Input label="Proficiency" name="proficiency" value={this._levelProficieny(values.level)} readOnly>
                <label>Proficiency</label>
              </Form.Input>
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

  _levelProficieny = (level) => {
    const classProficiencyLevels = {
      1: 2,
      5: 3,
      9: 4,
      13: 5,
      17: 6
    };
  }

}


