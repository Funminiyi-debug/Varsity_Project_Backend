import Joi from "joi";

const googgleFacebookSchema = Joi.object().keys({
  id: Joi.string().min(10).required(),
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
    .pattern(/^\S+@\S+$/)
    .required(),
  token: Joi.string().alphanum().min(3).max(200).required(),
});

export default googgleFacebookSchema;
