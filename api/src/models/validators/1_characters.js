import Joi from 'joi';
import Yup from 'yup';

import { meta } from './index';

export const character = meta.keys({
  primaryLevel: Joi.number().integer().min(1).required(),
  proficiency: Joi.number().integer().min(2).required(),
  xp: Joi.number().integer().min(0).required(),
  ac: Joi.number().integer().min(0).required(),
  traits: Joi.object.keys({
    race: Joi.string().required(),
    primaryClass: Joi.string().required(),
    alignment: Joi.string().required(),
    background: Joi.string(),
    sex: Joi.string(),
    backgroundInformation: Joi.string().default(''),
    physicalCharacteristics: Joi.string(),
    featuresAndTraits: Joi.string()
  }),
  health: Joi.objects.keys({
    currentHitPoints: Joi.number().integer().required(),
    maxHitPoints: Joi.number().integer().min(1).required(),
    hitDie: Joi.string().required()
  }),
  abilities: Joi.object.keys({
    strength: Joi.object.keys({
      baseValue: Joi.number().integer().min(1).required(),
      raceBonus: Joi.number().integer().min(0),
      total: Joi.number().integer().default(1).min(1).required(),
      modifier: Joi.number().integer().min(-5).max(5).required(),
      savingThrows: Joi.boolean().default(false)
    }),
    dexterity: Joi.object.keys({
      baseValue: Joi.number().integer().min(1).required(),
      raceBonus: Joi.number().integer().min(0),
      total: Joi.number().integer().default(1).min(1).required(),
      modifier: Joi.number().integer().min(-5).max(5).required(),
      savingThrows: Joi.boolean().default(false)
    }),
    constitution: Joi.object.keys({
      baseValue: Joi.number().integer().min(1).required(),
      raceBonus: Joi.number().integer().min(0),
      total: Joi.number().integer().default(1).min(1).required(),
      modifier: Joi.number().integer().min(-5).max(5).required(),
      savingThrows: Joi.boolean().default(false)
    }),
    intelligence: Joi.object.keys({
      baseValue: Joi.number().integer().min(1).required(),
      raceBonus: Joi.number().integer().min(0),
      total: Joi.number().integer().default(1).min(1).required(),
      modifier: Joi.number().integer().min(-5).max(5).required(),
      savingThrows: Joi.boolean().default(false)
    }),
    wisdom: Joi.object.keys({
      baseValue: Joi.number().integer().min(1).required(),
      raceBonus: Joi.number().integer().min(0),
      total: Joi.number().integer().default(1).min(1).required(),
      modifier: Joi.number().integer().min(-5).max(5).required(),
      savingThrows: Joi.boolean().default(false)
    }),
    charisma: Joi.object.keys({
      baseValue: Joi.number().integer().min(1).required(),
      raceBonus: Joi.number().integer().min(0),
      total: Joi.number().integer().default(1).min(1).required(),
      modifier: Joi.number().integer().min(-5).max(5).required(),
      savingThrows: Joi.boolean().default(false)
    })
  })
});

export const message = Yup.object().shape({
  rolls: Yup.array.of(
    Yup.object().shape({
      input: Yup.string().required(),
      label: Yup.string().required()
    })
  )
});
