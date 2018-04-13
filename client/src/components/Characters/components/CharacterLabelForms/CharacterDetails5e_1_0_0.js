import React, { Component } from 'react';
import { Field, Formik } from 'formik';
import { Form, Grid } from 'semantic-ui-react';
import Yup from 'yup';


export default class CharacterDetails5e_1_0_0 extends Component {

  render() {
    const { characterLabelDetails, loading } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        initialValues={characterToValues(characterLabelDetails) || validationSchema.default()}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
        render={({ values, handleChange, handleReset, handleSubmit, isSubmitting }) => (
          <Form className="character-details" action={handleSubmit} loading={loading}>
            <h2>Custom Character Settings</h2>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Race</label>
                <Field
                  name="traits.race"
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
                  name="traits.alignment"
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

              <Form.Field required label="XP" name="xp" control={Field} type="number" min="0"/>
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Primary Class</label>
                <Field
                  name="traits.primaryClass"
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

              <Form.Field required label="Level" name="level" control={Field} type="number" min="1" max="20"/>

              <Form.Input label="Proficiency" name="proficiency" value={this._levelProficieny(values.level)} readOnly>
                <label>Proficiency</label>
              </Form.Input>
            </Form.Group>

            <h3>Health</h3>

            <Form.Group widths="equal">
              <Form.Field required>
                <Form.Field required label="Current" name="health.currentHitPoints" control={Field} type="number"
                            min="0"/>
              </Form.Field>

              <Form.Field required>
                <Form.Field required label="Max" name="health.maxHitPoints" control={Field} type="number" min="1"/>
              </Form.Field>

              <Form.Field required>
                <Form.Field required label="Hit Die" name="health.hitDie" control={Field} type="number" min="0"/>
              </Form.Field>
            </Form.Group>

            <h3>Background and Traits</h3>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Background</label>
                <Field
                  name="background"
                  component="select"
                >
                  <option value="background1">back1</option>
                </Field>
              </Form.Field>

              <Form.Field required>
                <label>Sex</label>
                <Field
                  name="traits.sex"
                  component="select"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </Field>
              </Form.Field>
            </Form.Group>

            <Form.Field required>
              <label>Physical Characteristics</label>
              <Form.Field name="traits.physicalCharacteristics" control="textarea" value={values.traits.physicalCharacteristics}/>
            </Form.Field>

            <Form.Field required>
              <label>Features and Traits</label>
              <Form.Field name="traits.featuresTraits" control="textarea" value={values.traits.featuresTraits}/>
            </Form.Field>

            <h3>Abilities</h3>

            <Grid columns={3} divided>
              <Grid.Row>
                <Grid.Column>
                  <h4>Strength</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="strength.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="strength.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="strength.modifier" type="number" min="0" readOnly/>
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <h4>Dexterity</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="dexterity.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="dexterity.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="dexterity.modifier" type="number" min="0" readOnly/>
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <h4>Constitution</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="constitution.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="constitution.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="constitution.modifier" type="number" min="0" readOnly/>
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <h4>Inelligence</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="intelligence.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="intelligence.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="intelligence.modifier" type="number" min="0" readOnly/>
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <h4>Wisdom</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="wisdom.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="wisdom.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="wisdom.modifier" type="number" min="0" readOnly/>
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <h4>Charisma</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="charisma.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="charisma.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="charisma.modifier" type="number" min="0" readOnly/>
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>

            </Grid>
          </Form>
        )}
      />
    );
  }

  _handleSubmit = (props, values, { setSubmitting, setErrors }) => {
    const { onSave } = props;
    const payload = validationSchema.noUnknown().cast(values);

    setSubmitting(true);
    try {
      onSave(payload);
    } catch (e) {
      setSubmitting(false);
      setErrors(e);
    }
  };

  _handleCancel = () => {
    this.props.onCancel();
  };

  _levelProficieny = (level) => {
    const classProficiencyLevels = {
      1: 2,
      5: 3,
      9: 4,
      13: 5,
      17: 6
    };
  };

}

const validationSchema = Yup.object().shape({
  primaryLevel: Yup.number().integer().default(1).min(1).required(),
  proficiency: Yup.number().integer().default(2).min(2).required(),
  xp: Yup.number().integer().default(0).min(0).required(),
  traits: Yup.object().shape({
    race: Yup.string().default(''),
    primaryClass: Yup.string().default(''),
    alignment: Yup.string().default(''),
    sex: Yup.string().default(''),
    physicalCharacteristics: Yup.string().default(''),
    featuresAndTraits: Yup.string().default('')
  }),
  health: Yup.object().shape({
    currentHitPoints: Yup.number().integer().default(0),
    maxHitPoints: Yup.number().integer().default(1).min(1),
    hitDie: Yup.string().default('')
  }),
  abilities: Yup.object().shape({
    strength: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      savingThrowProficient: Yup.boolean().default(false),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(0)
    }),
    dexterity: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(0)
    }),
    constitution: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(0)
    }),
    intelligence: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(0)
    }),
    wisdow: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(0)
    }),
    charisma: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(0)
    })
  })
});

function characterToValues(character) {
  return character && validationSchema.noUnknown().cast(character);
}



