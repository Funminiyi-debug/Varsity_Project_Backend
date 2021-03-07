import { Hidden } from "tsoa";
import AdStatus from "../../enums/AdStatus";
import { IField } from "../IField";
interface IProduct {
  title: string;
  subcategoryId: string;
  id?: string;
  adStatus: AdStatus;
  school: string;
  price: string;
  delivery: boolean;
  otherFields?: any[];
}

export default IProduct;
