import { IProduct, IFilter } from "../interfaces/entities";
const ProductServiceFilter = function (req, res, next) {
  const data = req.query;

  const dbEntity: IFilter = {
    name: data.name,
    school: data.school,
    priceMin: data.pricemin,
    priceMax: data.pricemax,
    sortBy: data.sortby,
    delivery: data.delivery,
    searchTerm: data.searchterm,
  };

  const allNecessaryKeys = [
    "name",
    "school",
    "pricemin",
    "pricemax",
    "sortby",
    "delivery",
    "searchterm",
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
