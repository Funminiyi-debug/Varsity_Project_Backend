import Joi from "joi";

const PostSchema = Joi.object().keys({
  title: Joi.string().min(3).required(),
  postType: Joi.string().valid("Regular", "Poll"),
  question: Joi.string().min(5).max(125),
  sector: Joi.string().required(),
  options: Joi.string(),
  pollExpiryDate: Joi.string(),
});

export default PostSchema;
