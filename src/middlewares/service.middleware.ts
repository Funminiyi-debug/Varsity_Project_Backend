import AdStatus from "../enums/AdStatus";
import { IService } from "../interfaces/entities";

const formatServiceSchema = (req, res, next) => {
  const data = req.body;

  const dbEntity: IService = {
    title: data.title,
    categoryId: data.categoryId,
    adStatus: data.adStatus,
    school: data.school,
    price: data.price,
    delivery: data.delivery,
  };
  const allNecessaryKeys = [
    "title",
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

  req.body = dbEntity;
  return next();
};

export { formatServiceSchema };
