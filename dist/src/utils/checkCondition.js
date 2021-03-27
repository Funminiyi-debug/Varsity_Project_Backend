"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPriceRange = void 0;
const checkCondition = (fromDb, test) => {
    if (test == undefined)
        return true;
    if (typeof test == "string")
        return fromDb.toString().toLowerCase() == test.toLowerCase();
    return fromDb == test;
};
const checkPriceRange = (dbPrice, priceMax, priceMin) => priceMax > parseFloat(dbPrice) && parseFloat(dbPrice) > priceMin;
exports.checkPriceRange = checkPriceRange;
exports.default = checkCondition;
//# sourceMappingURL=checkCondition.js.map