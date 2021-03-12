import Joi from "joi";

const PostSchema = Joi.object().keys({
  title: Joi.alternatives().conditional("postType", {
    is: "Regular",
    then: Joi.string().min(3).required(),
  }),
  postType: Joi.string().valid("Regular", "Poll"),
  question: Joi.alternatives().conditional("postType", {
    is: "Poll",
    then: Joi.string().min(5).max(125).required(),
  }),
  sector: Joi.string().required(),
  options: Joi.alternatives().conditional("postType", {
    is: "Poll",
    then: Joi.string().min(5).max(125).required(),
  }),
  pollExpiryDate: Joi.alternatives().conditional("postType", {
    is: "Poll",
    then: Joi.string().min(5).max(125).required(),
  }),
});

export default PostSchema;
