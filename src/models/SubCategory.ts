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
  // let subcategory = this as any;
  // const id = subcategory.getFilter()["_id"];
  // try {
  //   // remove child prducts
  //   const products = await Product.find({ subcategory: id });
  //   products.forEach(async (product) => {
  //     const deleted = await Product.deleteOne({ _id: product._id });
  //     console.log("Child product deleted from model subcategory", deleted);
  //   });
  // } catch (error) {
  //   console.log("because", error);
  //   throw new ServerErrorException("unable to delete subcategory");
  // }
  Product.remove({ subcategory: this._id }).exec();
  next();
});

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
