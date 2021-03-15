import Joi from "joi";
import PostType from "../enums/PostType";

const PostSchema = Joi.object().keys({
  title: Joi.alternatives().conditional("postType", {
    is: PostType.Regular,
    then: Joi.string().min(3).required(),
  }),
  postType: Joi.string().valid(PostType.Regular, PostType.Poll),
  question: Joi.alternatives().conditional("postType", {
    is: PostType.Poll,
    then: Joi.string().min(5).max(125).required(),
  }),
  sector: Joi.string()
    .required()
    .valid(
      "Business",
      "Poll",
      "Entertainment",
      "Sports & Hobbies",
      "Science & Tech",
      "General",
      "Animal & Pets"
    ),
  options: Joi.alternatives().conditional("postType", {
    is: PostType.Poll,
    then: Joi.array().required(),
  }),
  pollExpiryDate: Joi.alternatives().conditional("postType", {
    is: PostType.Poll,
    then: Joi.date().min(5).max(125).required(),
  }),
});

export default PostSchema;
