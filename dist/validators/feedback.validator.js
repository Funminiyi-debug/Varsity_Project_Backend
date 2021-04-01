"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const FeedbackStatus_1 = __importDefault(require("../enums/FeedbackStatus"));
const FeedbackSchema = joi_1.default.object().keys({
    message: joi_1.default.string().min(5).required(),
    productid: joi_1.default.string().min(16).required(),
    feedbackid: joi_1.default.string().min(16).optional(),
    feedbackStatus: joi_1.default.string().valid(FeedbackStatus_1.default.Positive, FeedbackStatus_1.default.Negative, FeedbackStatus_1.default.Neutral),
});
exports.default = FeedbackSchema;
//# sourceMappingURL=feedback.validator.js.map