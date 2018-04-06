import Joi from 'joi';

import { meta } from './index';

const label1 = meta.keys({
  primaryLevel: Joi.number().integer().min(1).required(),
  proficiency: Joi.number().integer().min(2).required(),
  xp: Joi.number().integer().min(0).required(),
  traits: Joi.object.keys({
    race: Joi.string(),
    primaryClass: Joi.string(),
    alignment: Joi.string(),
    sex: Joi.string(),
    physicalCharacteristics: Joi.string(),
    featuresAndTraits: Joi.string()
  }),
  health: Joi.objects.keys({
    currentHitPoints: Joi.number().integer(),
    maxHitPoints: Joi.number().integer().min(1),
    hitDie: Joi.string()
  }),
  abilities: Joi.object.keys({
    strength: Joi.object.keys({
      baseValue: Joi.number().integer().min(1),
      savingThrowProficient: Joi.boolean(),
      raceBonus: Joi.number().integer().min(0),
      modifier: Joi.number().integer().min(0)
    })
  })
});

export default label1;
