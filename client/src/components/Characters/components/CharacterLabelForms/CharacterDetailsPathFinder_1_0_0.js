import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form as FormikForm, Formik } from 'formik';
import { Form, Grid, Radio } from 'semantic-ui-react';
import Yup from 'yup';

import { propsChanged, propsBase } from '../../../../services/props';
import FormFieldErrorMessage from '../../../../components/shared/components/FormFieldErrorMessage';


export default class CharacterDetails5e_1_0_0 extends Component {

  static propTypes = {
    renderActions: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    characterDetails: PropTypes.object
  };

  render() {
    const { characterDetails, loading, renderActions } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        initialValues={characterToValues(characterDetails) || validationSchema.default()}
        onSubmit={this._handleSubmit}
        validationSchema={validationSchema}
        render={({ values, dirty, setFieldValue, validateForm, submitForm, resetForm, isValid, handleChange, submitCount }) => (
          <React.Fragment>
            <Form className="character-details" as={FormikForm} loading={loading}>
              <FormFieldAutoCalculator values={values} setFieldValue={setFieldValue}/>

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
                    <option value="gnome">Gnome</option>
                    <option value="halfelf">Half-Elf</option>
                    <option value="halforc">Half-Orc</option>
                    <option value="halfling">Halfling</option>
                    <option value="human">Human</option>
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

                <Form.Field required>
                  <label>XP</label>
                  <Field name="xp" type="number" min="0"/>
                  <FormFieldErrorMessage name="xp"/>
                </Form.Field>
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
                    <option value="wizard">Wizard</option>
                  </Field>
                </Form.Field>

                <Form.Field required>
                  <label>Level</label>
                  <Field name="primaryLevel" type="number" min="1" max="20" />
                  <FormFieldErrorMessage name="primaryLevel"/>
                </Form.Field>

                <Form.Field label="Proficiency" name="proficiency" control={Field} readOnly/>
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

                <Form.Field>
                  <Form.Field required label="Hit Die" name="health.hitDie" control={Field} type="text"/>
                  <FormFieldErrorMessage name="health.hitDie"/>
                </Form.Field>
              </Form.Group>

              <h3>Background and Traits</h3>

              <Form.Group widths="equal">
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
                            onChange={handleChange}
                            value={values.traits.backgroundInformation}/>
              </Form.Field>
              <Form.Field required>
                <label>Physical Characteristics</label>
                <Form.Field name="traits.physicalCharacteristics"
                            control="textarea"
                            placeholder="Describe notable physical characteristics"
                            onChange={handleChange}
                            value={values.traits.physicalCharacteristics}/>
                <FormFieldErrorMessage name="traits.physicalCharacteristics"/>
              </Form.Field>
              <Form.Field required>
                <label>Features and Traits</label>
                <Form.Field name="traits.featuresAndTraits"
                            onChange={handleChange}
                            placeholder="Describe Features and Traits"
                            control="textarea"
                            value={values.traits.featuresAndTraits}/>
                <FormFieldErrorMessage name="traits.featuresAndTraits"/>
              </Form.Field>

              <h3>Abilities</h3>

              <Grid columns={3} divided>
                <Grid.Row>
                  <Grid.Column>
                    <h4>Strength</h4>
                    <Form.Field required>
                      <label>Base</label>
                      <Field name="abilities.strength.baseValue" type="number" min="1"/>
                      <FormFieldErrorMessage name="abilities.strength.baseValue"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Race Bonus</label>
                      <Field name="abilities.strength.raceBonus" type="number" min="0"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Total</label>
                      <Field name="abilities.strength.total" type="number" min="0" readOnly/>
                    </Form.Field>
                    <Form.Field>
                      <label>Modifier</label>
                      <Field name="abilities.strength.modifier" type="number" min="0" readOnly/>
                    </Form.Field>
                  </Grid.Column>

                  <Grid.Column>
                    <h4>Dexterity</h4>
                    <Form.Field required>
                      <label>Base</label>
                      <Field name="abilities.dexterity.baseValue" type="number" min="1"/>
                      <FormFieldErrorMessage name="abilities.dexterity.baseValue"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Race Bonus</label>
                      <Field name="abilities.dexterity.raceBonus" type="number" min="0"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Total</label>
                      <Field name="abilities.dexterity.total" type="number" min="0" readOnly/>
                    </Form.Field>
                    <Form.Field>
                      <label>Modifier</label>
                      <Field name="abilities.dexterity.modifier" type="number" min="0" readOnly/>
                    </Form.Field>
                  </Grid.Column>

                  <Grid.Column>
                    <h4>Constitution</h4>
                    <Form.Field required>
                      <label>Base</label>
                      <Field name="abilities.constitution.baseValue" type="number" min="1"/>
                      <FormFieldErrorMessage name="abilities.constitution.baseValue"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Race Bonus</label>
                      <Field name="abilities.constitution.raceBonus" type="number" min="0"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Total</label>
                      <Field name="abilities.constitution.total" type="number" min="0" readOnly/>
                    </Form.Field>
                    <Form.Field>
                      <label>Modifier</label>
                      <Field name="abilities.constitution.modifier" type="number" min="0" readOnly/>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column>
                    <h4>Inelligence</h4>
                    <Form.Field required>
                      <label>Base</label>
                      <Field name="abilities.intelligence.baseValue" type="number" min="1"/>
                      <FormFieldErrorMessage name="abilities.intelligence.baseValue"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Race Bonus</label>
                      <Field name="abilities.intelligence.raceBonus" type="number" min="0"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Total</label>
                      <Field name="abilities.intelligence.total" type="number" min="0" readOnly/>
                    </Form.Field>
                    <Form.Field>
                      <label>Modifier</label>
                      <Field name="abilities.intelligence.modifier" type="number" min="0" readOnly/>
                    </Form.Field>
                  </Grid.Column>

                  <Grid.Column>
                    <h4>Wisdom</h4>
                    <Form.Field required>
                      <label>Base</label>
                      <Field name="abilities.wisdom.baseValue" type="number" min="1"/>
                      <FormFieldErrorMessage name="abilities.wisdom.baseValue"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Race Bonus</label>
                      <Field name="abilities.wisdom.raceBonus" type="number" min="0"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Total</label>
                      <Field name="abilities.wisdom.total" type="number" min="0" readOnly/>
                    </Form.Field>
                    <Form.Field>
                      <label>Modifier</label>
                      <Field name="abilities.wisdom.modifier" type="number" min="0" readOnly/>
                    </Form.Field>
                  </Grid.Column>

                  <Grid.Column>
                    <h4>Charisma</h4>
                    <Form.Field required>
                      <label>Base</label>
                      <Field name="abilities.charisma.baseValue" type="number" min="1"/>
                      <FormFieldErrorMessage name="abilities.charisma.baseValue"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Race Bonus</label>
                      <Field name="abilities.charisma.raceBonus" type="number" min="0"/>
                    </Form.Field>
                    <Form.Field>
                      <label>Total</label>
                      <Field name="abilities.charisma.total" type="number" min="0" readOnly/>
                    </Form.Field>
                    <Form.Field>
                      <label>Modifier</label>
                      <Field name="abilities.charisma.modifier" type="number" min="0" readOnly/>
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>

              </Grid>
            </Form>
            {renderActions({ validateForm, submitForm, resetForm, isValid, dirty, submitCount })}
          </React.Fragment>
        )}
      />
    );
  }

  // only called if the form is valid
  _handleSubmit = (values, { setSubmitting, setErrors }) => {
    const { onSubmit } = this.props;
    const payload = validationSchema.noUnknown().cast(values);

    setSubmitting(true);
    try {
      onSubmit(payload);
    } catch (e) {
      setSubmitting(false);
      setErrors(e);
    }
  };

}

const validationSchema = Yup.object().shape({
  primaryLevel: Yup.number().integer().default(1).min(1).required(),
  proficiency: Yup.number().integer().default(2).min(2).required(),
  xp: Yup.number().integer().default(0).min(0).required(),
  traits: Yup.object().shape({
    race: Yup.string().default('dwarf').required(),
    primaryClass: Yup.string().default('barbarian').required(),
    alignment: Yup.string().default('n').required(),
    sex: Yup.string().default('other'),
    backgroundInformation: Yup.string().label('background information').default(''),
    physicalCharacteristics: Yup.string().label('physical characteristics').default('').required(),
    featuresAndTraits: Yup.string().label('features and traits').default('').required()
  }),
  health: Yup.object().shape({
    currentHitPoints: Yup.number().integer().default(0).required(),
    maxHitPoints: Yup.number().integer().default(1).min(1).required(),
    hitDie: Yup.string().label('hit die').default('').required()
  }),
  abilities: Yup.object().shape({
    strength: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
      raceBonus: Yup.number().integer().default(0).min(0),
      total: Yup.number().integer().default(1).min(1).required(),
      modifier: Yup.number().integer().default(-5).min(-5).max(5).required()
    }),
    dexterity: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
      raceBonus: Yup.number().integer().default(0).min(0),
      total: Yup.number().integer().default(1).min(1).required(),
      modifier: Yup.number().integer().default(-5).min(-5).max(5).required()
    }),
    constitution: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
      raceBonus: Yup.number().integer().default(0).min(0),
      total: Yup.number().integer().default(1).min(1).required(),
      modifier: Yup.number().integer().default(-5).min(-5).max(5).required()
    }),
    intelligence: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
      raceBonus: Yup.number().integer().default(0).min(0),
      total: Yup.number().integer().default(1).min(1).required(),
      modifier: Yup.number().integer().default(-5).min(-5).max(5).required()
    }),
    wisdom: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
      raceBonus: Yup.number().integer().default(0).min(0),
      total: Yup.number().integer().default(1).min(1).required(),
      modifier: Yup.number().integer().default(-5).min(-5).max(5).required()
    }),
    charisma: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
      raceBonus: Yup.number().integer().default(0).min(0),
      total: Yup.number().integer().default(1).min(1).required(),
      modifier: Yup.number().integer().default(-5).min(-5).max(5).required()
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
        valuesPropsChanged(`abilities.${ability}.raceBonus`)
      ) {
        setFieldValue(`abilities.${ability}.total`, this._abilityTotal(ability));
        setFieldValue(`abilities.${ability}.modifier`, this._abilityModifier(ability));
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

    return value('baseValue') + value('raceBonus');
  };

  _abilityModifier = (ability) => {
    const value = _.partial(propsBase, this.props, 'values', `abilities.${ability}`);

    return _.floor((value('baseValue') + value('raceBonus') - 10) / 2);
  };

}
