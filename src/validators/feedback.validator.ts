import Joi from "joi";

const FeedbackSchema = Joi.object().keys({
  message: Joi.string().min(5).required(),
  productid: Joi.string().min(16),
  serviceid: Joi.string().min(16),
  feedbackid: Joi.string().min(16).required(),
});

export default FeedbackSchema;
