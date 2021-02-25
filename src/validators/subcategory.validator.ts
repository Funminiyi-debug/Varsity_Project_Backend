import Joi from "joi";

const SubcategorySchema = Joi.object().keys({
  name: Joi.string().min(5).required(),
  product: Joi.string(),
  category: Joi.string().required(),
});

export default SubcategorySchema;
