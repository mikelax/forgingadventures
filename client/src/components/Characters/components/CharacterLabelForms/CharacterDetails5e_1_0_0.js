import _ from 'lodash';
import React, { Component } from 'react';
import { Field, Form as FormikForm, Formik } from 'formik';
import { Form, Grid, Radio } from 'semantic-ui-react';
import Yup from 'yup';

import { propsChanged, propsBase } from '../../../../services/props';


export default class CharacterDetails5e_1_0_0 extends Component {

  render() {
    const { characterLabelDetails, loading } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        initialValues={characterToValues(characterLabelDetails) || validationSchema.default()}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
        render={({ values, handleChange, handleReset, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form className="character-details" as={FormikForm} loading={loading}>
            <FormFieldAutoCalculator values={values} setFieldValue={setFieldValue} />

            <h2>Custom Character Settings</h2>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Race</label>
                <Field
                  name="traits.race"
                  component="select"
                  className="field"
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
                  className="field"
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
                  className="field"
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

              <Form.Field required label="Level" name="primaryLevel" control={Field} type="number" min="1" max="20"/>

              <Form.Field label="Proficiency" name="proficiency" control={Field} readOnly />
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
                <Form.Field required label="Hit Die" name="health.hitDie" control={Field} type="text"/>
              </Form.Field>
            </Form.Group>

            <h3>Background and Traits</h3>

            <Form.Group widths="equal">
              <Form.Field required>
                <label>Background</label>
                <Field
                  name="background"
                  component="select"
                  className="field"
                >
                  <option value="acolyte">Acolyte</option>
                  <option value="charlatan">Charlatan</option>
                  <option value="criminal">Criminal</option>
                  <option value="entertainer">Entertainer</option>
                  <option value="folkhero">Folk Hero</option>
                  <option value="guildartisan">Guild Artisan</option>
                  <option value="herit">Hermit</option>
                  <option value="noble">Noble</option>
                  <option value="outlander">Outlander</option>
                  <option value="pirate">Pirate</option>
                  <option value="sage">Sage</option>
                  <option value="sailor">Sailor</option>
                  <option value="soldier">Soldier</option>
                  <option value="urchin">Urchin</option>
                  <option value="other">Other - Variant</option>
                </Field>
              </Form.Field>

              <Form.Field required>
                <label>Sex</label>
                <Field
                  name="traits.sex"
                  component="select"
                  className="field"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </Field>
              </Form.Field>
            </Form.Group>

            <Form.Field>
              <label>Additional Background Information</label>
              <Form.Field name="traits.backgroundInformation"
                          control="textarea"
                          placeholder="Add additional Background Information"
                          value={values.traits.backgroundInformation}/>
            </Form.Field>
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
                    <Field name="abilities.strength.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="abilities.strength.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="abilities.strength.modifier" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Total</label>
                    <Field name="abilities.strength.total" type="number" min="0" readOnly/>
                  </Form.Field>
                  <Radio label="Saving Throws" name="abilities.strength.savingThrows" toggle />
                </Grid.Column>

                <Grid.Column>
                  <h4>Dexterity</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="abilities.dexterity.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="abilities.dexterity.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="abilities.dexterity.modifier" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Total</label>
                    <Field name="abilities.dexterity.total" type="number" min="0" readOnly/>
                  </Form.Field>
                  <Radio label="Saving Throws" name="abilities.dexterity.savingThrows" toggle />
                </Grid.Column>

                <Grid.Column>
                  <h4>Constitution</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="abilities.constitution.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="abilities.constitution.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="abilities.constitution.modifier" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Total</label>
                    <Field name="abilities.constitution.total" type="number" min="0" readOnly/>
                  </Form.Field>
                  <Radio label="Saving Throws" name="abilities.constitution.savingThrows" toggle />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <h4>Inelligence</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="abilities.intelligence.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="abilities.intelligence.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="abilities.intelligence.modifier" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Total</label>
                    <Field name="abilities.intelligence.total" type="number" min="0" readOnly/>
                  </Form.Field>
                  <Radio label="Saving Throws" name="abilities.intelligence.savingThrows" toggle />
                </Grid.Column>

                <Grid.Column>
                  <h4>Wisdom</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="abilities.wisdom.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="abilities.wisdom.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="abilities.wisdom.modifier" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Total</label>
                    <Field name="abilities.wisdom.total" type="number" min="0" readOnly/>
                  </Form.Field>
                  <Radio label="Saving Throws" name="abilities.wisdom.savingThrows" toggle />
                </Grid.Column>

                <Grid.Column>
                  <h4>Charisma</h4>
                  <Form.Field required>
                    <label>Base</label>
                    <Field name="abilities.charisma.baseValue" type="number" min="1"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Race Bonus</label>
                    <Field name="abilities.charisma.raceBonus" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Modifier</label>
                    <Field name="abilities.charisma.modifier" type="number" min="0"/>
                  </Form.Field>
                  <Form.Field>
                    <label>Total</label>
                    <Field name="abilities.charisma.total" type="number" min="0" readOnly/>
                  </Form.Field>
                  <Radio label="Saving Throws" name="abilities.charisma.savingThrows" toggle />
                </Grid.Column>
              </Grid.Row>

            </Grid>
          </Form>
        )}
      />
    );
  }

  valid() {

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

}

const validationSchema = Yup.object().shape({
  primaryLevel: Yup.number().integer().default(1).min(1).required(),
  proficiency: Yup.number().integer().default(2).min(2).required(),
  xp: Yup.number().integer().default(0).min(0).required(),
  traits: Yup.object().shape({
    race: Yup.string().default(''),
    primaryClass: Yup.string().default(''),
    alignment: Yup.string().default(''),
    background: Yup.string().default(''),
    sex: Yup.string().default(''),
    backgroundInformation: Yup.string().default(''),
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
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(-5).max(5),
      total: Yup.number().integer().default(1).min(1),
      savingThrows: Yup.boolean().default(false)
    }),
    dexterity: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(-5).max(5),
      total: Yup.number().integer().default(1).min(1),
      savingThrows: Yup.boolean().default(false)
    }),
    constitution: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(-5).max(5),
      total: Yup.number().integer().default(1).min(1),
      savingThrows: Yup.boolean().default(false)
    }),
    intelligence: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(-5).max(5),
      total: Yup.number().integer().default(1).min(1),
      savingThrows: Yup.boolean().default(false)
    }),
    wisdom: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(-5).max(5),
      total: Yup.number().integer().default(1).min(1),
      savingThrows: Yup.boolean().default(false)
    }),
    charisma: Yup.object().shape({
      baseValue: Yup.number().integer().default(1).min(1),
      raceBonus: Yup.number().integer().default(0).min(0),
      modifier: Yup.number().integer().default(0).min(-5).max(5),
      total: Yup.number().integer().default(1).min(1),
      savingThrows: Yup.boolean().default(false)
    })
  })
});

function characterToValues(character) {
  return character && validationSchema.noUnknown().cast(character);
}

class FormFieldAutoCalculator extends Component {

  componentDidUpdate(prevProps) {
    const { setFieldValue } = this.props;
    const valuesPropsChanged = _.partial(propsChanged, prevProps, this.props, 'values');

    if (valuesPropsChanged('primaryLevel')) {
      const primaryLevel = _.get(this.props, 'values.primaryLevel');

      // calculate proficiency
      if (primaryLevel) {
        setFieldValue('proficiency', this._levelProficiency(primaryLevel));
      } else {
        setFieldValue('proficiency', '');
      }
    }

    // ability totals
    _.each(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'], (ability) => {
      if (
        valuesPropsChanged(`abilities.${ability}.baseValue`) ||
        valuesPropsChanged(`abilities.${ability}.raceBonus`) ||
        valuesPropsChanged(`abilities.${ability}.modifier`)
      ) {
        setFieldValue(`abilities.${ability}.total`, this._abilityTotal(ability));
      }
    });
  }

  render = () => null; // i haz no render

  _levelProficiency = (level) => {
    const classProficiencyLevels = {
      1: 2,
      5: 3,
      9: 4,
      13: 5,
      17: 6
    };

    return _(classProficiencyLevels)
      .chain()
      .keys()
      .filter(lookupLevel => level >= lookupLevel)
      .last()
      .thru(matched => classProficiencyLevels[matched])
      .value();
  };

  _abilityTotal = (ability) => {
    const value = _.partial(propsBase, this.props, 'values', `abilities.${ability}`);

    return value('baseValue') + value('raceBonus') + value('modifier');
  }

}
