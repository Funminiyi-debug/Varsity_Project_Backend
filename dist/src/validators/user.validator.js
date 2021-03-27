"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const UserSchema = joi_1.default.object().keys({
    id: joi_1.default.string().length(16),
    userName: joi_1.default.string().min(3),
    email: joi_1.default.string()
        .email()
        .lowercase()
        .pattern(/^\S+@\S+$/),
    phoneNumber: joi_1.default.string()
        .length(14)
        .pattern(/^[\+]?[234]\d{12}$/),
    gender: joi_1.default.string().min(4).max(6),
    business: joi_1.default.string().min(3),
    whatsappNo: joi_1.default.string().min(11).max(14),
    website: joi_1.default.string().min(3).max(20),
    aboutCompany: joi_1.default.string().min(3).max(70),
});
exports.default = UserSchema;
//# sourceMappingURL=user.validator.js.map