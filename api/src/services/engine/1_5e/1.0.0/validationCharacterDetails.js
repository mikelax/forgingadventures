import Yup from 'yup';

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
    strength: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').min(1).required(),
      raceBonus: Yup.number().integer().min(0),
      total: Yup.number().integer().min(1).required(),
      modifier: Yup.number().integer().min(-5).max(5).required(),
      savingThrows: Yup.boolean()
    }).required(),
    dexterity: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').min(1).required(),
      raceBonus: Yup.number().integer().min(0),
      total: Yup.number().integer().min(1).required(),
      modifier: Yup.number().integer().min(-5).max(5).required(),
      savingThrows: Yup.boolean()
    }).required(),
    constitution: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').min(1).required(),
      raceBonus: Yup.number().integer().min(0),
      total: Yup.number().integer().min(1).required(),
      modifier: Yup.number().integer().min(-5).max(5).required(),
      savingThrows: Yup.boolean()
    }).required(),
    intelligence: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').min(1).required(),
      raceBonus: Yup.number().integer().min(0),
      total: Yup.number().integer().min(1).required(),
      modifier: Yup.number().integer().min(-5).max(5).required(),
      savingThrows: Yup.boolean()
    }).required(),
    wisdom: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').min(1).required(),
      raceBonus: Yup.number().integer().min(0),
      total: Yup.number().integer().min(1).required(),
      modifier: Yup.number().integer().min(-5).max(5).required(),
      savingThrows: Yup.boolean()
    }).required(),
    charisma: Yup.object().shape({
      baseValue: Yup.number().integer().label('base value').min(1).required(),
      raceBonus: Yup.number().integer().min(0),
      total: Yup.number().integer().min(1).required(),
      modifier: Yup.number().integer().min(-5).max(5).required(),
      savingThrows: Yup.boolean()
    }).required()
  }).required()
});
