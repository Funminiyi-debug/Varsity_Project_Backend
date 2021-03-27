"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const SubcategorySchema = joi_1.default.object().keys({
    name: joi_1.default.string().min(3).required(),
    product: joi_1.default.string(),
    category: joi_1.default.string().min(16).required(),
});
exports.default = SubcategorySchema;
//# sourceMappingURL=subcategory.validator.js.map