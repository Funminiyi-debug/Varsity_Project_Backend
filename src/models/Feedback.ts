import mongoose from "mongoose";
import FeedbackStatus from "../enums/FeedbackStatus";
import Product from "./Product";
const Schema = mongoose.Schema;

const LikeSchema = new Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // feedback: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
  },
  { timestamps: true }
);

const FeedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    feedbackStatus: {
      type: String,
      enum: [
        FeedbackStatus.Positive,
        FeedbackStatus.Neutral,
        FeedbackStatus.Negative,
      ],
      required: true,
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    likes: [{ type: LikeSchema }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    feedback: { type: Schema.Types.ObjectId, ref: "Feedback" },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.virtual("noOfLikes").get(function () {
  return this.likes.length;
});

FeedbackSchema.pre("remove", function (next) {
  // Feedback.remove({ feedback: this._id }).exec();
  Feedback.remove({ replies: this._id }).exec();

  next();
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
