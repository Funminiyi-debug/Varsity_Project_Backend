"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = exports.generateSecretToken = exports.generateRandomNumber = void 0;
const jwtHelper_1 = __importDefault(require("../config/jwtHelper"));
function generateRandomNumber(numLenght = 6) {
    const chars = [..."0123456789"];
    return [...Array(numLenght)]
        .map((i) => chars[(Math.random() * chars.length) | 0])
        .join("");
}
exports.generateRandomNumber = generateRandomNumber;
function generateSecretToken() {
    const key = [...Array(30)]
        .map((n) => ((Math.random() * 36) | 0).toString(36))
        .join("");
    return key;
}
exports.generateSecretToken = generateSecretToken;
function generateJwtToken(user) {
    const { _id, email, displayName } = user;
    const jwtAccessToken = jwtHelper_1.default.sign({
        _id,
        email,
        displayName,
    });
    return jwtAccessToken;
}
exports.generateJwtToken = generateJwtToken;
//# sourceMappingURL=helperFunction.js.map