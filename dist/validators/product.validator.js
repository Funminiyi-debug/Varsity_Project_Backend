"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const ProductSchema = joi_1.default.object().keys({
    title: joi_1.default.string().min(3).required(),
    type: joi_1.default.string().valid("Service", "Product"),
    subcategoryId: joi_1.default.alternatives().conditional("type", {
        is: "Product",
        then: joi_1.default.string().min(16).required(),
    }),
    categoryId: joi_1.default.alternatives().conditional("type", {
        is: "Service",
        then: joi_1.default.string().min(16).required(),
    }),
    adStatus: joi_1.default.string()
        .valid("Active", "InReview", "Hidden", "Draft", "Declined")
        .required(),
    school: joi_1.default.string().min(3).required(),
    price: joi_1.default.string().required(),
    delivery: joi_1.default.boolean().required(),
    otherFields: joi_1.default.array(),
});
exports.default = ProductSchema;
//# sourceMappingURL=product.validator.js.map