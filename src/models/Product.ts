import mongoose from "mongoose";
import AdStatus from "../enums/AdStatus";
import AppFile from "./AppFile";
import Feedback from "./Feedback";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      // required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "AppFile",
      },
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
    otherFields: { type: Array },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("remove", async function () {
  AppFile.remove({ subcategoryId: this._id }).exec();
  Feedback.remove({ product: this._id }).exec();
});

ProductSchema.index({ "$**": "text" });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
