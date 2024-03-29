import mongoose, { Document, Types } from "mongoose";
import CategoryType from "../../enums/CategoryType";
interface ICategory {
  name: string;
  categoryType: CategoryType;
  index: number;
}

export default ICategory;
