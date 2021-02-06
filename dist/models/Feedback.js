"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FeedbackStatus_1 = __importDefault(require("../enums/FeedbackStatus"));
const Schema = mongoose_1.default.Schema;
const FeedbackSchema = new mongoose_1.default.Schema({
    message: { type: String, required: true },
    feedbackStatus: {
        type: Number,
        enum: [
            FeedbackStatus_1.default.Happy,
            FeedbackStatus_1.default.Indifferent,
            FeedbackStatus_1.default.Indifferent,
        ],
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    likes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    feedbackId: { type: Schema.Types.ObjectId, ref: "Feedback" },
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
}, {
    timestamps: true,
});
FeedbackSchema.pre("remove", function (next) {
    Feedback.remove({ feedbackId: this._id }).exec();
    Feedback.remove({ productId: this._id }).exec();
    next();
});
const Feedback = mongoose_1.default.model("Feedback", FeedbackSchema);
exports.default = Feedback;
//# sourceMappingURL=Feedback.js.map