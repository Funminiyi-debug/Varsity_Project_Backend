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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const types_1 = __importDefault(require("../types"));
const exceptions_1 = require("../exceptions");
let SubcategoryService = class SubcategoryService {
    /**
     *
     */
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    // get all subcategories
    async getSubcategories() {
        try {
            return await SubCategory_1.default.find().populate("products");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    //   get subcategry by id
    async getSubcategory(id) {
        try {
            return await SubCategory_1.default.find({ _id: id }).populate("products");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    //   get subcategory by any condition
    async getSubcategoryByCondition(query) {
        try {
            return await SubCategory_1.default.find(query).populate("products");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    //   creates a subcategory
    async createSubcategory(entity) {
        const exists = await SubCategory_1.default.find({
            name: entity.name,
            category: entity.category,
        });
        if (exists.length > 0) {
            throw new exceptions_1.ConflictException("subcategory already exist");
        }
        const createdSubcategory = await SubCategory_1.default.create(entity);
        const addCategory = await this.categoryService.addSubcategoryToCategory(entity.category, createdSubcategory.id);
        console.log("category added", addCategory);
        if (addCategory) {
            return createdSubcategory;
        }
        throw new exceptions_1.ServerErrorException("unable to add subcategory to category");
        // return createdSubcategory;
    }
    //   updates a subcategory
    async updateSubcategory(id, entity) {
        try {
            return await SubCategory_1.default.findByIdAndUpdate(id, entity);
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    //   add product to a subcategory
    async addProductToSubcategory(id, productid) {
        try {
            await SubCategory_1.default.findByIdAndUpdate(id, {
                $push: {
                    products: productid,
                },
            });
            return true;
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async deleteSubcategory(id) {
        try {
            return (await SubCategory_1.default.findById(id)).remove();
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
};
SubcategoryService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.ICategoryService)),
    __metadata("design:paramtypes", [Object])
], SubcategoryService);
exports.default = SubcategoryService;
//# sourceMappingURL=subcategory.service.js.map