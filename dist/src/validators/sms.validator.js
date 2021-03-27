"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const smsSchema = joi_1.default.object().keys({
    phoneNumber: joi_1.default.string()
        .length(14)
        .pattern(/^[\+]?[234]\d{12}$/)
        .required(),
});
exports.default = smsSchema;
//# sourceMappingURL=sms.validator.js.map