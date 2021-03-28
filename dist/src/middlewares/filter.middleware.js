"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServiceFilter = void 0;
const ProductServiceFilter = function (req, res, next) {
    const data = req.query;
    const dbEntity = {
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
exports.ProductServiceFilter = ProductServiceFilter;
//# sourceMappingURL=filter.middleware.js.map