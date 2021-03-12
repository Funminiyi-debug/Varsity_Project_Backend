import { IProduct, IFilter } from "../interfaces/entities";

const ProductServiceFilter = function (req, res, next) {
  const data: IFilter = req.query;

  const dbEntity: IFilter = {
    name: data.name,
    school: data.school,
    priceMin: data.priceMin,
    priceMax: data.priceMax,
    sortBy: data.sortBy,
  };

  const allNecessaryKeys = ["name", "school", "priceMin", "priceMax", "sortBy"];

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
  next();
};

export { ProductServiceFilter };
