import mongoose, { Document, Types } from "mongoose";
import CategoryType from "../enums/CategoryType";
interface ICategory {
  _id?: string;
  name: string;
  subcategory: string[];
  services: string[];
  categoryType: CategoryType;
}

export default ICategory;
