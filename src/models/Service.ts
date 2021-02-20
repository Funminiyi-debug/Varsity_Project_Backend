import mongoose from "mongoose";
import AdStatus from "../enums/AdStatus";
import AppFile from "./AppFile";
import Feedback from "./Feedback";
import FieldSchema from "./FieldSchema";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "AppFile" },
    ],
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],

    adStatus: {
      type: String,
      enum: [
        AdStatus.Active,
        AdStatus.InReview,
        AdStatus.Hidden,
        AdStatus.Declined,
        AdStatus.Draft,
      ],
      default: AdStatus.Active,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    school: { type: String, required: true },
    price: { type: String, required: true },
    otherFields: [FieldSchema],
  },
  {
    timestamps: true,
  }
);

ServiceSchema.pre("remove", function (next) {
  AppFile.remove({ subcategoryId: this._id }).exec();
  Feedback.remove({ productId: this._id }).exec();
  next();
});

const Service = mongoose.model("Service", ServiceSchema);
export default Service;
