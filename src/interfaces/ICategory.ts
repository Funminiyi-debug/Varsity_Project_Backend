import mongoose, { Document, Types } from "mongoose";
import CategoryType from "../enums/CategoryType";
interface ICategory {
  name: string;
  categoryType: CategoryType;
}

export default ICategory;
