import Joi from "joi";

const SubcategorySchema = Joi.object().keys({
  name: Joi.string().min(3).required(),
  product: Joi.string(),
  category: Joi.string().min(16).required(),
});

export default SubcategorySchema;
