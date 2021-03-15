import Joi from "joi";

const adminUpdateUserSchema = Joi.object().keys({
  id: Joi.string().length(16).required(),
  verificationStatus: Joi.string()
    .valid("Verified", "NotVerified", "Restricted")
    .required(),
});

export default adminUpdateUserSchema;
