"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateSmsCodeSchema = joi_1.default.object().keys({
    phoneCode: joi_1.default.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
});
exports.default = validateSmsCodeSchema;
//# sourceMappingURL=phonecode.validator.js.map