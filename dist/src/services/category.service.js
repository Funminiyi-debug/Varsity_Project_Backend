"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
const inversify_1 = require("inversify");
const exceptions_1 = require("../exceptions");
let CategoryService = class CategoryService {
    constructor() { }
    async addSubcategoryToCategory(id, subcategoryid) {
        try {
            const data = await Category_1.default.findByIdAndUpdate(id, {
                $push: {
                    subcategory: subcategoryid,
                },
            });
            console.log("updatedCategory", data);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async addServiceToCategory(id, serviceid) {
        try {
            await Category_1.default.findByIdAndUpdate(id, {
                $push: {
                    service: serviceid,
                },
            });
            return true;
        }
        catch (error) {
            console.log("add service to category", error);
            return false;
        }
    }
    async getCategories() {
        return await Category_1.default.find({}).populate("subcategory").populate("services");
        // const results = this.productService.getData();
    }
    async getCategory(id) {
        return await Category_1.default.find({ _id: id })
            .populate("subcategory")
            .populate("services");
    }
    async getCategoryByCondition(query) {
        return await Category_1.default.find(query)
            .populate("subcategory")
            .populate("services");
    }
    async createCategory(entity) {
        const exists = await Category_1.default.find({ name: entity.name });
        if (exists.length > 0) {
            return null;
        }
        const category = new Category_1.default(entity);
        return await category.save();
        // return await Category.create({
        //   name: entity.name,
        //   categoryType: entity.categoryType,
        // });
    }
    async updateCategory(id, entity) {
        return await Category_1.default.findByIdAndUpdate(id, entity, { new: true });
    }
    async deleteCategory(id) {
        //return await Category.findByIdAndDelete(id);
        try {
            return await (await Category_1.default.findById(id)).remove();
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
};
CategoryService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], CategoryService);
exports.default = CategoryService;
//# sourceMappingURL=category.service.js.map