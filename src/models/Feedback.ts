import mongoose from "mongoose";
import FeedbackStatus from "../enums/FeedbackStatus";
const Schema = mongoose.Schema;

const FeedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    feedbackStatus: {
      type: Number,
      enum: [
        FeedbackStatus.Happy,
        FeedbackStatus.Indifferent,
        FeedbackStatus.Indifferent,
      ],
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    likes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    feedbackId: { type: Schema.Types.ObjectId, ref: "Feedback" },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.pre("remove", function (next) {
  Feedback.remove({ feedbackId: this._id }).exec();
  Feedback.remove({ productId: this._id }).exec();
  next();
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
