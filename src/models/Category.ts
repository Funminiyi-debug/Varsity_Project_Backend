import mongoose from "mongoose";
import CategoryType from "../enums/CategoryType";
import { ServerErrorException } from "../exceptions";
import Product from "./Product";
import SubCategory from "./SubCategory";

function requiredIf(model, type) {
  return [model == type, `type of ${type} is required`];
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  index: { type: Number, required: true, unique: true },
  subcategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: function requiredIf() {
        this.categoryType == CategoryType.Product;
      },
      ref: "SubCategory",
    },
  ],

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: function requiredIf() {
        this.categoryType == CategoryType.Services;
      },
    },
  ],
});

CategorySchema.pre("remove", function (next) {
  SubCategory.remove({ category: this._id }).exec();
  return next();
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
