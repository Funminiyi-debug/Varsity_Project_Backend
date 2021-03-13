import { IProduct, IFilter } from "../interfaces/entities";
const ProductServiceFilter = function (req, res, next) {
  const data: IFilter = req.query;

  const dbEntity: IFilter = {
    name: data.name,
    school: data.school,
    priceMin: data.priceMin,
    priceMax: data.priceMax,
    sortBy: data.sortBy,
    delivery: data.delivery,
  };

  const allNecessaryKeys = [
    "name",
    "school",
    "pricemin",
    "pricemax",
    "sortby",
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

  req.query = { ...dbEntity };
  next();
};

export { ProductServiceFilter };
