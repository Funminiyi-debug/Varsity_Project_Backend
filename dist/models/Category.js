"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategoryType_1 = __importDefault(require("../enums/CategoryType"));
const SubCategory_1 = __importDefault(require("./SubCategory"));
function requiredIf(model, type) {
    return [model == type, `type of ${type} is required`];
}
const CategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    subcategory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: function requiredIf() {
                this.categoryType == CategoryType_1.default.Product;
            },
            ref: "SubCategory",
        },
    ],
    products: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Product",
            required: function requiredIf() {
                this.categoryType == CategoryType_1.default.Services;
            },
        },
    ],
});
CategorySchema.pre("remove", function (next) {
    SubCategory_1.default.remove({ category: this._id }).exec();
    return next();
});
const Category = mongoose_1.default.model("Category", CategorySchema);
exports.default = Category;
//# sourceMappingURL=Category.js.map