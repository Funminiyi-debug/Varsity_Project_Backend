import AdStatus from "../enums/AdStatus";
import { IProduct } from "../interfaces/entities";

const formatProductSchema = (req, res, next) => {
  const data = req.body;

  console.log("from first middleware", req.body);
  const dbEntity: IProduct = {
    title: data.title,
    subcategoryId: data.subcategoryId,
    adStatus: data.adStatus,
    school: data.school,
    price: data.price,
    delivery: data.delivery,
  };
  const allNecessaryKeys = [
    "title",
    "subcategoryid",
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

  req.body = dbEntity;
  return next();
};

export { formatProductSchema };
