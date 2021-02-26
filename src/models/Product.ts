import mongoose from "mongoose";
import AdStatus from "../enums/AdStatus";
import { ServerErrorException } from "../exceptions";
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
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
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
    otherFields: [FieldSchema],
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre("deleteOne", async function () {
  let product = this as any;
  const id = product.getFilter()["_id"];
  try {
    // remove child appfiles
    const appfiles = await Product.find({ product: id });
    appfiles.forEach(async (appfile) => {
      const deleted = await AppFile.deleteOne({ _id: appfile._id });
      console.log("Child appfile deleted from model product", deleted);
    });

    // remove child feedback
    const feedbacks = await Product.find({ product: id });
    feedbacks.forEach(async (feedback) => {
      const deleted = await Feedback.deleteOne({ _id: feedback._id });
      console.log("Child feedback deleted from model product", deleted);
    });
  } catch (error) {
    console.log("because", error);
    throw new ServerErrorException("unable to delete product");
  }

  // AppFile.remove({ subcategoryId: this._id }).exec();
  // Feedback.remove({ productId: this._id }).exec();
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
