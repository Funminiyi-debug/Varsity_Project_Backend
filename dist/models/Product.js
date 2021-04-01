"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdStatus_1 = __importDefault(require("../enums/AdStatus"));
const AppFile_1 = __importDefault(require("./AppFile"));
const Feedback_1 = __importDefault(require("./Feedback"));
const ProductSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subcategory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SubCategory",
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
    },
    feedbacks: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Feedback" }],
    images: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "AppFile",
        },
    ],
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
    school: { type: String, required: true },
    price: { type: String, required: true },
    delivery: { type: Boolean, required: true },
    otherFields: { type: Array },
}, {
    timestamps: true,
});
ProductSchema.pre("remove", async function () {
    AppFile_1.default.remove({ subcategoryId: this._id }).exec();
    Feedback_1.default.remove({ product: this._id }).exec();
});
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map