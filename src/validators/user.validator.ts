import Joi from "joi";

const UserSchema = Joi.object().keys({
  id: Joi.string().length(16),
  userName: Joi.string().min(3),
  email: Joi.string()
    .email()
    .lowercase()
    .pattern(/^\S+@\S+$/),
  phoneNumber: Joi.string()
    .length(14)
    .pattern(/^[\+]?[234]\d{12}$/),
  gender: Joi.string().min(4).max(6),
});

export default UserSchema;
