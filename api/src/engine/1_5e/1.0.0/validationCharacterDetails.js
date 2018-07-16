import _ from 'lodash';
import Yup from 'yup';

const abilityShape = {
  baseValue: Yup.number().integer().label('base value').min(1).required(),
  raceBonus: Yup.number().integer().min(0),
  total: Yup.number().integer().min(1).required(),
  modifier: Yup.number().integer().min(-5).required(),
  savingThrows: Yup.boolean()
};

const skillShape = {
  proficient: Yup.boolean().required(),
  bonus: Yup.number().integer().min(-5).required()
};

const dexSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().oneOf(['dexterity']).required()
});
const intSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().oneOf(['intelligence']).required()
});
const wisSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().oneOf(['wisdom']).required()
});
const charSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().oneOf(['charisma']).required()
});
const strSkillShape = _.merge({}, skillShape, {
  ability: Yup.string().oneOf(['strength']).required()
});


export default Yup.object().shape({
  meta: Yup.object().shape({
    version: Yup.string().required()
  }).required(),
  primaryLevel: Yup.number().integer().min(1).required(),
  proficiency: Yup.number().integer().min(2).required(),
  xp: Yup.number().integer().min(0).required(),
  ac: Yup.number().integer().min(0).required(),
  traits: Yup.object().shape({
    race: Yup.string().required(),
    primaryClass: Yup.string().required(),
    alignment: Yup.string().required(),
    background: Yup.string(),
    sex: Yup.string(),
    backgroundInformation: Yup.string().label('background information'),
    physicalCharacteristics: Yup.string().label('physical characteristics').required(),
    featuresAndTraits: Yup.string().label('features and traits').required()
  }).required(),
  health: Yup.object().shape({
    currentHitPoints: Yup.number().integer().required(),
    maxHitPoints: Yup.number().integer().min(1).required(),
    hitDie: Yup.string().label('hit die').required()
  }).required(),
  abilities: Yup.object().shape({
    strength: Yup.object().shape(abilityShape).required(),
    dexterity: Yup.object().shape(abilityShape).required(),
    constitution: Yup.object().shape(abilityShape).required(),
    intelligence: Yup.object().shape(abilityShape).required(),
    wisdom: Yup.object().shape(abilityShape).required(),
    charisma: Yup.object().shape(abilityShape).required()
  }).required(),
  skills: Yup.object().shape({
    acrobatics: Yup.object().shape(dexSkillShape).required(),
    animalHandling: Yup.object().shape(wisSkillShape).required(),
    arcana: Yup.object().shape(intSkillShape).required(),
    athletics: Yup.object().shape(strSkillShape).required(),
    deception: Yup.object().shape(charSkillShape).required(),
    history: Yup.object().shape(intSkillShape).required(),
    insight: Yup.object().shape(wisSkillShape).required(),
    intimidation: Yup.object().shape(charSkillShape).required(),
    investigation: Yup.object().shape(intSkillShape).required(),
    medicine: Yup.object().shape(wisSkillShape).required(),
    nature: Yup.object().shape(intSkillShape).required(),
    perception: Yup.object().shape(wisSkillShape).required(),
    performance: Yup.object().shape(charSkillShape).required(),
    persuasion: Yup.object().shape(charSkillShape).required(),
    religion: Yup.object().shape(intSkillShape).required(),
    sleightOfHand: Yup.object().shape(dexSkillShape).required(),
    stealth: Yup.object().shape(dexSkillShape).required(),
    survival: Yup.object().shape(wisSkillShape).required()
  }).required()
});
