import Joi from "joi";

const usernameSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
});

export default usernameSchema;
