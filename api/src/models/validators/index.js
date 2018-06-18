import Joi from 'joi';

export default Joi.object.keys({
  version: Joi.string().required(),
  gameLabelId: Joi.number().integer().min(1).required()
});
