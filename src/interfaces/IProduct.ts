import { AnyAaaaRecord, AnyARecord } from "dns";
import mongoose, { Document, Types } from "mongoose";
import AdStatus from "../enums/AdStatus";
import CategoryType from "../enums/CategoryType";
import { IField } from "./IField";
interface IProduct {
  _id?: string;
  title: string;
  author: string;
  subcategoryId: string;
  images: any[];
  adStatus: AdStatus;
  feedbacks?: string[];
  school: string;
  price: string;
  delivery: string;
  otherFields: IField[];
}

export default IProduct;
