"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const adminUpdateUserSchema = joi_1.default.object().keys({
    id: joi_1.default.string().length(16).required(),
    verificationStatus: joi_1.default.string()
        .valid("Verified", "NotVerified", "Restricted")
        .required(),
});
exports.default = adminUpdateUserSchema;
//# sourceMappingURL=adminUpdateUser.validator.js.map