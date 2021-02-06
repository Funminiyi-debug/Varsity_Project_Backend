import mongoose from "mongoose";
import AdStatus from "../enums/AdStatus";
import AppFile from "./AppFile";
import Feedback from "./Feedback";
import FieldSchema from "./FieldSchema";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
    images: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "AppFile" },
    ],
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
    school: { type: String, required: true },
    price: { type: String, required: true },
    delivery: { type: Boolean, required: true },
    otherFields: [FieldSchema],
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("remove", function (next) {
  AppFile.remove({ subcategoryId: this._id }).exec();
  Feedback.remove({ productId: this._id }).exec();
  next();
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
