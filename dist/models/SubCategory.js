"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("./Product"));
const SubCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" }],
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category" },
}, {
    timestamps: true,
});
SubCategorySchema.pre("remove", function (next) {
    Product_1.default.remove({ subcategoryId: this._id }).exec();
    next();
});
const SubCategory = mongoose_1.default.model("SubCategory", SubCategorySchema);
exports.default = SubCategory;
//# sourceMappingURL=SubCategory.js.map