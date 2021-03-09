import AdStatus from "../enums/AdStatus";
import { IProduct } from "../interfaces/entities";

const formatProductSchema = (req, res, next) => {
  const data = req.body;
  console.log("this ran in the middleware");
  const dbEntity: IProduct = {
    title: data.title,
    subcategoryId: data.subcategoryId,
    adStatus: data.adStatus,
    school: data.school,
    price: data.price,
    delivery: data.delivery,
    id: data.id,
  };
  const allNecessaryKeys = [
    "id",
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

  req.body = { ...dbEntity };

  return next();
};

export { formatProductSchema };
