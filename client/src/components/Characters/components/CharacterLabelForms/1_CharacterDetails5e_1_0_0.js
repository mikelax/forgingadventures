import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form as FormikForm, Formik } from 'formik';
import { Form, Grid, Segment, Radio } from 'semantic-ui-react';
import Yup from 'yup';

import { propsChanged, propsBase } from 'services/props';
import FormFieldErrorMessage from 'components/shared/FormFieldErrorMessage';
import RadioInput from 'components/shared/RadioInput';


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
        validateOnChange={false}
        validateOnBlur={true}
        render={({ values, dirty, touched, errors, setFieldValue, validateForm, submitForm, resetForm, handleChange, submitCount, isSubmitting }) => (
          <React.Fragment>
            <Segment>
              <Form className="character-details" as={FormikForm} loading={loading}>
                <FormFieldAutoCalculator
                  values={values}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  autoCalcSkillModifiers={_.isEmpty(characterDetails)}
                />

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

                  <Form.Field required>
                    <label>XP</label>
                    <Field name="xp" type="number" min="0" />
                    <FormFieldErrorMessage name="xp" />
                  </Form.Field>

                  <Form.Field required>
                    <label>Armour Class</label>
                    <Field name="ac" type="number" min="0" />
                    <FormFieldErrorMessage name="ac" />
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
                      <option value="warlock">Warlock</option>
                      <option value="wizard">Wizard</option>
                    </Field>
                  </Form.Field>

                  <Form.Field required>
                    <label>Level</label>
                    <Field name="primaryLevel" type="number" min="1" max="20" />
                    <FormFieldErrorMessage name="primaryLevel" />
                  </Form.Field>

                  <Form.Field label="Proficiency" name="proficiency" control={Field} readOnly />
                </Form.Group>

                <h3>Health</h3>

                <Form.Group widths="equal">
                  <Form.Field required>
                    <Form.Field required label="Current" name="health.currentHitPoints" control={Field} type="number"
                                min="0" />
                  </Form.Field>

                  <Form.Field required>
                    <Form.Field required label="Max" name="health.maxHitPoints" control={Field} type="number" min="1" />
                  </Form.Field>

                  <Form.Field>
                    <Form.Field required label="Hit Die" name="health.hitDie" control={Field} type="text" />
                    <FormFieldErrorMessage name="health.hitDie" />
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
                              onChange={handleChange}
                              value={values.traits.backgroundInformation} />
                </Form.Field>
                <Form.Field required>
                  <label>Physical Characteristics</label>
                  <Form.Field name="traits.physicalCharacteristics"
                              control="textarea"
                              placeholder="Describe notable physical characteristics"
                              onChange={handleChange}
                              value={values.traits.physicalCharacteristics} />
                  <FormFieldErrorMessage name="traits.physicalCharacteristics" />
                </Form.Field>
                <Form.Field required>
                  <label>Features and Traits</label>
                  <Form.Field name="traits.featuresAndTraits"
                              onChange={handleChange}
                              placeholder="Describe Features and Traits"
                              control="textarea"
                              value={values.traits.featuresAndTraits} />
                  <FormFieldErrorMessage name="traits.featuresAndTraits" />
                </Form.Field>

                <h3>Abilities</h3>

                <Grid columns={3} divided>
                  <Grid.Row>
                    <Grid.Column>
                      <h4>Strength</h4>
                      <Form.Field required>
                        <label>Base</label>
                        <Field name="abilities.strength.baseValue" type="number" min="1" />
                        <FormFieldErrorMessage name="abilities.strength.baseValue" />
                      </Form.Field>
                      <Form.Field>
                        <label>Race Bonus</label>
                        <Field name="abilities.strength.raceBonus" type="number" min="0" />
                      </Form.Field>
                      <Form.Field>
                        <label>Total</label>
                        <Field name="abilities.strength.total" type="number" min="0" readOnly />
                      </Form.Field>
                      <Form.Field>
                        <label>Modifier</label>
                        <Field name="abilities.strength.modifier" type="number" min="0" readOnly />
                      </Form.Field>
                      <RadioInput label="Saving Throws (+Proficiency)" name="abilities.strength.savingThrows" />
                    </Grid.Column>

                    <Grid.Column>
                      <h4>Dexterity</h4>
                      <Form.Field required>
                        <label>Base</label>
                        <Field name="abilities.dexterity.baseValue" type="number" min="1" />
                        <FormFieldErrorMessage name="abilities.dexterity.baseValue" />
                      </Form.Field>
                      <Form.Field>
                        <label>Race Bonus</label>
                        <Field name="abilities.dexterity.raceBonus" type="number" min="0" />
                      </Form.Field>
                      <Form.Field>
                        <label>Total</label>
                        <Field name="abilities.dexterity.total" type="number" min="0" readOnly />
                      </Form.Field>
                      <Form.Field>
                        <label>Modifier</label>
                        <Field name="abilities.dexterity.modifier" type="number" min="0" readOnly />
                      </Form.Field>
                      <RadioInput label="Saving Throws (+Proficiency)" name="abilities.dexterity.savingThrows" />
                    </Grid.Column>

                    <Grid.Column>
                      <h4>Constitution</h4>
                      <Form.Field required>
                        <label>Base</label>
                        <Field name="abilities.constitution.baseValue" type="number" min="1" />
                        <FormFieldErrorMessage name="abilities.constitution.baseValue" />
                      </Form.Field>
                      <Form.Field>
                        <label>Race Bonus</label>
                        <Field name="abilities.constitution.raceBonus" type="number" min="0" />
                      </Form.Field>
                      <Form.Field>
                        <label>Total</label>
                        <Field name="abilities.constitution.total" type="number" min="0" readOnly />
                      </Form.Field>
                      <Form.Field>
                        <label>Modifier</label>
                        <Field name="abilities.constitution.modifier" type="number" min="0" readOnly />
                      </Form.Field>
                      <RadioInput label="Saving Throws (+Proficiency)" name="abilities.constitution.savingThrows" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <h4>Inelligence</h4>
                      <Form.Field required>
                        <label>Base</label>
                        <Field name="abilities.intelligence.baseValue" type="number" min="1" />
                        <FormFieldErrorMessage name="abilities.intelligence.baseValue" />
                      </Form.Field>
                      <Form.Field>
                        <label>Race Bonus</label>
                        <Field name="abilities.intelligence.raceBonus" type="number" min="0" />
                      </Form.Field>
                      <Form.Field>
                        <label>Total</label>
                        <Field name="abilities.intelligence.total" type="number" min="0" readOnly />
                      </Form.Field>
                      <Form.Field>
                        <label>Modifier</label>
                        <Field name="abilities.intelligence.modifier" type="number" min="0" readOnly />
                      </Form.Field>
                      <RadioInput label="Saving Throws (+Proficiency)" name="abilities.intelligence.savingThrows" />
                    </Grid.Column>

                    <Grid.Column>
                      <h4>Wisdom</h4>
                      <Form.Field required>
                        <label>Base</label>
                        <Field name="abilities.wisdom.baseValue" type="number" min="1" />
                        <FormFieldErrorMessage name="abilities.wisdom.baseValue" />
                      </Form.Field>
                      <Form.Field>
                        <label>Race Bonus</label>
                        <Field name="abilities.wisdom.raceBonus" type="number" min="0" />
                      </Form.Field>
                      <Form.Field>
                        <label>Total</label>
                        <Field name="abilities.wisdom.total" type="number" min="0" readOnly />
                      </Form.Field>
                      <Form.Field>
                        <label>Modifier</label>
                        <Field name="abilities.wisdom.modifier" type="number" min="0" readOnly />
                      </Form.Field>
                      <RadioInput label="Saving Throws (+Proficiency)" name="abilities.wisdom.savingThrows" />
                    </Grid.Column>

                    <Grid.Column>
                      <h4>Charisma</h4>
                      <Form.Field required>
                        <label>Base</label>
                        <Field name="abilities.charisma.baseValue" type="number" min="1" />
                        <FormFieldErrorMessage name="abilities.charisma.baseValue" />
                      </Form.Field>
                      <Form.Field>
                        <label>Race Bonus</label>
                        <Field name="abilities.charisma.raceBonus" type="number" min="0" />
                      </Form.Field>
                      <Form.Field>
                        <label>Total</label>
                        <Field name="abilities.charisma.total" type="number" min="0" readOnly />
                      </Form.Field>
                      <Form.Field>
                        <label>Modifier</label>
                        <Field name="abilities.charisma.modifier" type="number" min="0" readOnly />
                      </Form.Field>
                      <RadioInput label="Saving Throws (+Proficiency)" name="abilities.charisma.savingThrows" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <h3>Skills</h3>

                <Grid columns={2} divided>
                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="acrobatics" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="animalHandling" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="arcana" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="athletics" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="deception" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="history" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="insight" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="intimidation" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="investigation" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="medicine" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="nature" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="perception" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="performance" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="persuasion" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="religion" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="sleightOfHand" />
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <SkillField skill="stealth" />
                    </Grid.Column>
                    <Grid.Column>
                      <SkillField skill="survival" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

              </Form>
            </Segment>

            {renderActions({ validateForm, submitForm, resetForm, errors, dirty, submitCount, isSubmitting })}
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
      setErrors(e);
    }

    setSubmitting(false);
  };

}

const abilityShape = {
  baseValue: Yup.number().integer().label('base value').default(1).min(1).required(),
  raceBonus: Yup.number().integer().default(0).min(0),
  total: Yup.number().integer().default(1).min(1).required(),
  modifier: Yup.number().integer().default(-5).min(-5).required(),
  savingThrows: Yup.boolean().default(false)
};

const skillShape = {
  proficient: Yup.boolean().default(false),
  bonus: Yup.number().integer().default(0).min(-5)
};

const dexSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().default('dexterity').oneOf(['dexterity'])
});
const intSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().default('intelligence').oneOf(['intelligence'])
});
const wisSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().default('wisdom').oneOf(['wisdom'])
});
const charSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().default('charisma').oneOf(['charisma'])
});
const strSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().default('strength').oneOf(['strength'])
});

const validationSchema = Yup.object().shape({
  meta: Yup.object().shape({
    version: Yup.string().default('1.0.0').required()
  }),
  primaryLevel: Yup.number().integer().default(1).min(1).required(),
  proficiency: Yup.number().integer().default(2).min(2).required(),
  xp: Yup.number().integer().default(0).min(0).required(),
  ac: Yup.number().integer().default(0).min(0).required(),
  traits: Yup.object().shape({
    race: Yup.string().default('dwarf').required(),
    primaryClass: Yup.string().default('barbarian').required(),
    alignment: Yup.string().default('n').required(),
    background: Yup.string().default('acolyte'),
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
    strength: Yup.object().shape(abilityShape),
    dexterity: Yup.object().shape(abilityShape),
    constitution: Yup.object().shape(abilityShape),
    intelligence: Yup.object().shape(abilityShape),
    wisdom: Yup.object().shape(abilityShape),
    charisma: Yup.object().shape(abilityShape)
  }),
  skills: Yup.object().shape({
    acrobatics: Yup.object().shape(dexSkillShape),
    animalHandling: Yup.object().shape(wisSkillShape),
    arcana: Yup.object().shape(intSkillShape),
    athletics: Yup.object().shape(strSkillShape),
    deception: Yup.object().shape(charSkillShape),
    history: Yup.object().shape(intSkillShape),
    insight: Yup.object().shape(wisSkillShape),
    intimidation: Yup.object().shape(charSkillShape),
    investigation: Yup.object().shape(intSkillShape),
    medicine: Yup.object().shape(wisSkillShape),
    nature: Yup.object().shape(intSkillShape),
    perception: Yup.object().shape(wisSkillShape),
    performance: Yup.object().shape(charSkillShape),
    persuasion: Yup.object().shape(charSkillShape),
    religion: Yup.object().shape(intSkillShape),
    sleightOfHand: Yup.object().shape(dexSkillShape),
    stealth: Yup.object().shape(dexSkillShape),
    survival: Yup.object().shape(wisSkillShape)
  })
});

function characterToValues(character) {
  return character && validationSchema.noUnknown().cast(character);
}

class SkillField extends Component {
  static contextTypes = {
    formik: PropTypes.object
  };

  static propTypes = {
    skill: PropTypes.string.isRequired
  };

  render() {
    const { skill } = this.props;
    const { context: { formik: { values } } } = this;

    const ability = _(values).chain().get(['skills', skill, 'ability']).take(3).join('').upperCase().value();
    const proficiency = _.get(values, ['skills', skill, 'proficient']);
    const bonusFieldName = `skills.${skill}.bonus`;

    const skillName = {
      animalHandling: 'animal handling',
      sleightOfHand: 'sleight of hand'
    }[skill];

    const displaySkill = _.capitalize(skillName || skill);

    return (
      <Grid columns={2} stackable verticalAlign="middle">
        <Grid.Row style={{ paddingTop: 4, paddingBottom: 4 }}>
          <Grid.Column largeScreen={12} computer={10} tablet={10}>
            <label>{`${displaySkill} (${ability}) Proficient`}</label>
          </Grid.Column>

          <Grid.Column largeScreen={2} computer={3} tablet={3}>
            <Radio
              toggle
              checked={proficiency}
              onChange={this._handleCheck}
            />
          </Grid.Column>

          <Grid.Column largeScreen={2} computer={3} tablet={3}>
            <Field
              name={bonusFieldName}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  _handleCheck = (e, data) => {
    const { context: { formik: { setFieldValue } } } = this;
    const { skill } = this.props;
    const { checked } = data;
    const fieldName = `skills.${skill}.proficient`;

    setFieldValue(fieldName, checked);
  };
}

class FormFieldAutoCalculator extends Component {

  componentDidUpdate(prevProps) {
    const { setFieldValue, autoCalcSkillModifiers } = this.props;
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
    if (autoCalcSkillModifiers) {
      _.each(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'], (ability) => {
        if (
          valuesPropsChanged(`abilities.${ability}.baseValue`) ||
          valuesPropsChanged(`abilities.${ability}.raceBonus`)
        ) {
          const modifier = this._abilityModifier(ability);

          setFieldValue(`abilities.${ability}.total`, this._abilityTotal(ability));
          setFieldValue(`abilities.${ability}.modifier`, modifier);

          this._updateUntouchedSkillBonuses(ability, modifier);
        }
      });
    }

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

  _updateUntouchedSkillBonuses = (ability, modifier) => {
    const { setFieldValue, touched } = this.props;

    const abilitySkills = {
      dexterity: ['acrobatics', 'sleightOfHand', 'stealth'],
      intelligence: ['arcana', 'history', 'investigation', 'nature', 'religion'],
      wisdom: ['animalHandling', 'insight', 'medicine', 'perception', 'survival'],
      charisma: ['deception', 'intimidation', 'performance', 'persuasion'],
      strength: ['athletics']
    }[ability];

    _.each(abilitySkills, (skill) => {
      const skillBonusFieldName = `skills.${skill}.bonus`;

      if ( !(_.get(touched, skillBonusFieldName)) ) {
        setFieldValue(skillBonusFieldName, modifier);
      }
    });
  }

}
