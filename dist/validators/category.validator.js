"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const CategorySchema = joi_1.default.object().keys({
    name: joi_1.default.string().min(3).required(),
    categoryType: joi_1.default.string().valid("Product", "Service").required(),
});
exports.default = CategorySchema;
//# sourceMappingURL=category.validator.js.map