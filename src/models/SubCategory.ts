import mongoose from "mongoose";
import { ServerErrorException } from "../exceptions";
import Category from "./Category";
import Product from "./Product";

const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

SubCategorySchema.pre("remove", async function (next) {
  Product.remove({ subcategory: this._id }).exec();
  next();
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
