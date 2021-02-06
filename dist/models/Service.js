"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdStatus_1 = __importDefault(require("../enums/AdStatus"));
const AppFile_1 = __importDefault(require("./AppFile"));
const Feedback_1 = __importDefault(require("./Feedback"));
const FieldSchema_1 = __importDefault(require("./FieldSchema"));
const ServiceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: [
        { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "AppFile" },
    ],
    feedbacks: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Feedback" }],
    adStatus: {
        type: String,
        enum: [
            AdStatus_1.default.Active,
            AdStatus_1.default.InReview,
            AdStatus_1.default.Hidden,
            AdStatus_1.default.Declined,
            AdStatus_1.default.Draft,
        ],
        default: AdStatus_1.default.Active,
    },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category" },
    school: { type: String, required: true },
    price: { type: String, required: true },
    otherFields: [FieldSchema_1.default],
}, {
    timestamps: true,
});
ServiceSchema.pre("remove", function (next) {
    AppFile_1.default.remove({ subcategoryId: this._id }).exec();
    Feedback_1.default.remove({ productId: this._id }).exec();
    next();
});
const Service = mongoose_1.default.model("Service", ServiceSchema);
exports.default = Service;
//# sourceMappingURL=Service.js.map