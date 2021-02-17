import { Hidden } from "tsoa";
import AdStatus from "../enums/AdStatus";
import { IField } from "./IField";
interface IProduct {
  title: string;
  author: string;
  subcategory: string;
  images: any[];
  adStatus: AdStatus;
  feedbacks?: string[];
  school: string;
  price: string;
  delivery: string;
  otherFields: IField[];
}

export default IProduct;
