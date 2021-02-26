import mongoose from "mongoose";
import CategoryType from "../enums/CategoryType";
import { ServerErrorException } from "../exceptions";
import Product from "./Product";
import Service from "./Service";
import SubCategory from "./SubCategory";

function requiredIf(model, type) {
  return [model == type, `type of ${type} is required`];
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: function requiredIf() {
        this.categoryType == CategoryType.Product;
      },
      ref: "SubCategory",
    },
  ],

  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: function requiredIf() {
        this.categoryType == CategoryType.Services;
      },
    },
  ],

  categoryType: {
    type: String,
    enum: [CategoryType.Product, CategoryType.Services],
    required: true,
  },
});

CategorySchema.pre("deleteOne", async function () {
  let category = this as any;
  const id = category.getFilter()["_id"];

  try {
    // remove services
    const services = await Service.find({
      category: id,
    });
    services.forEach(async (service) => {
      const deleted = await Service.deleteOne({ _id: service._id });
      console.log("Child service deleted from model post", deleted);
    });

    // remove subcategories
    const subcategories = await SubCategory.find({
      category: id,
    });
    subcategories.forEach(async (subcategory) => {
      const deleted = await SubCategory.deleteOne({ _id: subcategory._id });
      console.log("Child subcategory deleted from model post", deleted);
    });
  } catch (error) {
    console.log("because", error);
    throw new ServerErrorException("unable to delete category");
  }
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
