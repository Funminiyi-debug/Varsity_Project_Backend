import mongoose from "mongoose";
import Product from "./Product";

const SubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  {
    timestamps: true,
  }
);

SubCategorySchema.pre("remove", function (next) {
  Product.remove({ subcategoryId: this._id }).exec();
  next();
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
