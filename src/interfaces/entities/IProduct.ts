import { Hidden } from "tsoa";
import AdStatus from "../../enums/AdStatus";
import { IField } from "../IField";
interface IProduct {
  title: string;
  subcategoryId: string;
  // images: any[];
  adStatus: AdStatus;
  school: string;
  price: string;
  delivery: string;
  otherFields?: IField[];
}

export default IProduct;
