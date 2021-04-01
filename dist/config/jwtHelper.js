"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwthelper_1 = __importDefault(require("jwthelper"));
require("dotenv/config");
var helper = jwthelper_1.default.createJWTHelper({
    secret: process.env.JWT_KEY,
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
});
exports.default = helper;
//# sourceMappingURL=jwtHelper.js.map