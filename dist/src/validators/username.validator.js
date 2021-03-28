"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const usernameSchema = joi_1.default.object().keys({
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
});
exports.default = usernameSchema;
//# sourceMappingURL=username.validator.js.map