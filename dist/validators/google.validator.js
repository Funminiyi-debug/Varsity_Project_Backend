"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const googgleFacebookSchema = joi_1.default.object().keys({
    id: joi_1.default.string().min(10).required(),
    displayName: joi_1.default.string()
        .regex(/^[A-Z]+ [A-Z]+$/i)
        .required(),
    firstName: joi_1.default.string()
        .regex(/^[A-Z]+$/)
        .required(),
    lastName: joi_1.default.string()
        .regex(/^[A-Z]+$/)
        .required(),
    profilePics: joi_1.default.string(),
    email: joi_1.default.string()
        .email()
        .lowercase()
        .pattern(/^\S+@\S+$/)
        .required(),
    token: joi_1.default.string().alphanum().min(3).max(200).required(),
});
exports.default = googgleFacebookSchema;
//# sourceMappingURL=google.validator.js.map