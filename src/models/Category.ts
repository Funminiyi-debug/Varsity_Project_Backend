import mongoose from "mongoose";
import CategoryType from "../enums/CategoryType";
import Product from "./Product";
import Service from "./Service";
import SubCategory from "./SubCategory";

function requiredIf(type) {
  return [this.categoryType == type, `type of ${type} is required`];
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: requiredIf(CategoryType.Product),
      ref: "SubCategory",
    },
  ],
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: requiredIf(CategoryType.Services),
    },
  ],
  categoryType: {
    type: String,
    enum: [CategoryType.Product, CategoryType.Services],
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);

CategorySchema.pre("remove", function (next) {
  SubCategory.remove({ categoryId: this._id }).exec();
  Service.remove({ categoryId: this._id }).exec();
  next();
});

export default Category;
