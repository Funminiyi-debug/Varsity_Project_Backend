"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = void 0;
function generateRandomNumber(numLenght = 4) {
    const chars = [..."0123456789"];
    return [...Array(numLenght)]
        .map((i) => chars[(Math.random() * chars.length) | 0])
        .join("");
}
exports.generateRandomNumber = generateRandomNumber;
//# sourceMappingURL=helperFunction.js.map