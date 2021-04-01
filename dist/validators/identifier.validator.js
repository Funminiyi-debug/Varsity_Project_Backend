"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const IdentifierSchema = joi_1.default.string().min(16).required();
// keys({
//   id: Joi.string().length(16).required(),
// });
exports.default = IdentifierSchema;
//# sourceMappingURL=identifier.validator.js.map