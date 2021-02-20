import Joi from "joi";

const validateSmsCodeSchema = Joi.object().keys({
  phoneCode: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),
});

export default validateSmsCodeSchema;
