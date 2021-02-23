import Joi from "joi";

const CategorySchema = Joi.object().keys({
  name: Joi.string().min(5).required(),
  categoryType: Joi.string().valid("Product", "Service").required(),
});

export default CategorySchema;
