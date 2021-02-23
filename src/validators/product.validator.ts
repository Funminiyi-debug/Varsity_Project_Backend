import Joi from "joi";

const ProductSchema = Joi.object().keys({
  title: Joi.string().min(5).required(),
  subcategoryId: Joi.string().min(16).required(),
  adStatus: Joi.string()
    .valid("Active", "InReview", "Hidden", "Draft", "Declined")
    .required(),
  school: Joi.string().min(5).required(),
  price: Joi.string().required(),
  delivery: Joi.string().required(),
  otherFields: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      value: Joi.string(),
      options: Joi.array().items(Joi.string()),
    })
  ),
});

export default ProductSchema;
