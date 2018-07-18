import Yup from 'yup';

const abilityShape = {
  baseValue: Yup.number().integer().label('base value').min(1).required(),
  raceBonus: Yup.number().integer().min(0).required(),
  total: Yup.number().integer().min(1).required(),
  modifier: Yup.number().integer().min(-5).required()
};

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
  }).required()
});

