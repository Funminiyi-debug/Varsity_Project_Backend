import Joi from "joi";

const smsSchema = Joi.object().keys({
  phoneNumber: Joi.string()
    .length(14)
    .pattern(/^[\+]?[234]\d{12}$/)
    .required(),
});

export default smsSchema;
