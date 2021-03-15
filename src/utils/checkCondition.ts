const checkCondition = (fromDb, test): boolean => {
  if (test == undefined) return true;
  if (typeof test == "string")
    return fromDb.toString().toLowerCase() == test.toLowerCase();

  return fromDb == test;
};

export const checkPriceRange = (
  dbPrice: string,
  priceMax: number,
  priceMin: number
): boolean => priceMax > parseFloat(dbPrice) && parseFloat(dbPrice) > priceMin;
export default checkCondition;
