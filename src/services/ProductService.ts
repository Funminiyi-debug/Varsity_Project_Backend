import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable } from "inversify";
import { ICategoryService } from "./ICategoryService";

@injectable()
export default class ProductService {
  constructor() {}

 getData(){ 
     return "sample data"
 }
}
