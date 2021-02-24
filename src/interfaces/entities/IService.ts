import AdStatus from "../../enums/AdStatus";
import { IField } from "../IField";
interface IService {
  title: string;
  categoryId: string;
  // images: any[];
  adStatus: AdStatus;
  school: string;
  price: string;
  delivery: string;
  otherFields?: IField[];
}

export default IService;
