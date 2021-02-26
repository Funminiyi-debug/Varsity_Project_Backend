import Joi from "joi";

const IdentifierSchema = Joi.string().length(16).required();
// keys({
//   id: Joi.string().length(16).required(),
// });

export default IdentifierSchema;
