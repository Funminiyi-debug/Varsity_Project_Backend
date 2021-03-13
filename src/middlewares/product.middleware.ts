import AdStatus from "../enums/AdStatus";
import { IProduct } from "../interfaces/entities";
interface IProductType extends IProduct {
  type?: string;
}

const formatProductSchema = (req, res, next) => {
  const data = req.body;
  const dbEntity: IProductType = {
    title: data.title,
    subcategoryId: data.subcategoryId,
    categoryId: data.categoryId,
    adStatus: data.adStatus,
    school: data.school,
    price: data.price,
    delivery: data.delivery,
  };

  dbEntity.type = dbEntity.categoryId != undefined ? "Service" : "Product";
  data.id != undefined ? (dbEntity.id = data.id) : delete dbEntity.id;

  const allNecessaryKeys = [
    "id",
    "title",
    "subcategoryid",
    "categoryid",
    "adstatus",
    "school",
    "price",
    "delivery",
  ];
  const otherFields = Object.keys(data)
    .map((key) => {
      if (!allNecessaryKeys.includes(key.toLowerCase())) {
        return {
          [key]: data[key],
        };
      }
    })
    .filter((item) => item != undefined);

  dbEntity.otherFields = otherFields;

  req.body = { ...dbEntity };

  return next();
};

export { formatProductSchema };
