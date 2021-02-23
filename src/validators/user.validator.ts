import Joi from "joi";

const UserSchema = Joi.object().keys({
  id: Joi.string().min(16),
  name: Joi.string().min(5).required(),
  email: Joi.string()
    .email()
    .lowercase()
    .pattern(/^\S+@\S+$/)
    .required(),
  phoneNumber: Joi.string()
    .length(14)
    .pattern(/^[\+]?[234]\d{12}$/)
    .required(),
  token: Joi.string().alphanum().min(3).max(200).required(),
  gender: Joi.string().min(4).max(6),
  verificationStatus: Joi.string()
    .valid("Verified", "NotVerified", "Restricted")
    .required(),
});

export default UserSchema;
