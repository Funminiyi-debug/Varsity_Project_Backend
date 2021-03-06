import Joi from "joi";

const ProductSchema = Joi.object().keys({
  title: Joi.string().min(3).required(),
  categoryId: Joi.string().min(16).required(),
  adStatus: Joi.string()
    .valid("Active", "InReview", "Hidden", "Draft", "Declined")
    .required(),
  school: Joi.string().min(3).required(),
  price: Joi.string().required(),
  delivery: Joi.boolean().required(),
  otherFields: Joi.array(),
});

export default ProductSchema;
