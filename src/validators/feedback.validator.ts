import Joi from "joi";
import FeedbackStatus from "../enums/FeedbackStatus";

const FeedbackSchema = Joi.object().keys({
  message: Joi.string().min(5).required(),
  productid: Joi.string().min(16).required(),
  feedbackid: Joi.string().min(16).optional(),
  feedbackStatus: Joi.string().valid(
    FeedbackStatus.Positive,
    FeedbackStatus.Negative,
    FeedbackStatus.Neutral
  ),
});

export default FeedbackSchema;
