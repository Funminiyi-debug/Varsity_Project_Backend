import Joi from "joi";

const IdentifierSchema = Joi.object().keys({
  id: Joi.string().length(16).required(),
});

export default IdentifierSchema;
