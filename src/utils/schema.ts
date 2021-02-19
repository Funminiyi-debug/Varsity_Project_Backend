import Joi from "joi";

export const googgleFacebookSchema = Joi.object().keys({
  id: Joi.string().min(16).required(),
  displayName: Joi.string()
    .regex(/^[A-Z]+ [A-Z]+$/i)
    .required(),
  firstName: Joi.string()
    .regex(/^[A-Z]+$/)
    .required(),
  lastName: Joi.string()
    .regex(/^[A-Z]+$/)
    .required(),
  profilePics: Joi.string(),
  email: Joi.string()
    .email()
    .lowercase()
    .pattern(/^\S+@\S+[\.][0-9A-Z]+$/)
    .required(),
  token: Joi.string().alphanum().min(3).max(200).required(),
});

export const validateSmsCodeSchema = Joi.object().keys({
  phoneCode: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),
});

export const smsSchema = Joi.object().keys({
  phoneNumber: Joi.string()
    .length(14)
    .pattern(/^[\+]?[234]\d{12}$/)
    .required(),
});

export const usernameSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(4).max(30).required(),
});
