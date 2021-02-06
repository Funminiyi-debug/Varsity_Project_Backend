"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
class CategoryService {
    constructor() { }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.default.find({});
        });
    }
    getCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.default.find({ _id: id });
        });
    }
    getCategoryByCondition(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.default.find(query);
        });
    }
    createCategory(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = new Category_1.default(entity);
            return yield category.save();
        });
    }
    updateCategory(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findByIdAndUpdate(entity._id, entity);
        });
    }
    deleteCategory(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return Category_1.default.findByIdAndDelete(entity._id);
        });
    }
}
exports.default = CategoryService;
//# sourceMappingURL=CategoryService.js.map