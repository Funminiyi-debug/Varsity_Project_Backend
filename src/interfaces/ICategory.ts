import mongoose, { Document, Types } from "mongoose";
import CategoryType from "../enums/CategoryType";
interface ICategory {
  _id?: string;
  name: string;
  categoryType: CategoryType;
}

export default ICategory;
