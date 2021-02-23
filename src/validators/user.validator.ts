import Joi from "joi";

const UserSchema = Joi.object().keys({
  id: Joi.string().length(16),
  name: Joi.string().min(5),
  email: Joi.string()
    .email()
    .lowercase()
    .pattern(/^\S+@\S+$/),
  phoneNumber: Joi.string()
    .length(14)
    .pattern(/^[\+]?[234]\d{12}$/),
  token: Joi.string().alphanum().min(3).max(200),
  gender: Joi.string().min(4).max(6),
  verificationStatus: Joi.string()
    .valid("Verified", "NotVerified", "Restricted")
    .required(),
});

export default UserSchema;
