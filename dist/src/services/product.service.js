"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const Product_1 = __importDefault(require("../models/Product"));
const types_1 = __importDefault(require("../types"));
const exceptions_1 = require("../exceptions");
require("../utils/flatArray");
const checkCondition_1 = __importStar(require("../utils/checkCondition"));
let ProductService = class ProductService {
    constructor(appfileService, subcategoryService, categoryService) {
        this.appfileService = appfileService;
        this.subcategoryService = subcategoryService;
        this.categoryService = categoryService;
    }
    async searchProduct(searchTerm) {
        //  takeCount = takeCount == undefined ? 10 : takeCount;
        //  pageNo = pageNo == undefined ? 1 : pageNo;
        //  const skip = (pageNo - 1) * takeCount;
        const allProducts = await Product_1.default.find({
            $text: { $search: searchTerm },
        })
            .populate({ path: "author", select: "userName email" })
            .populate({ path: "subcategory", select: "name" })
            .populate({ path: "category", select: "name" })
            .populate({ path: "images", select: "mimetype name" })
            .populate("feedbacks");
        searchTerm = searchTerm.toLowerCase();
        function checkConditions(element) {
            const { subcategory, category, author, school, price, otherFields, } = element;
            let isProduct = false;
            let isService = false;
            if (element.subcategory != undefined) {
                isProduct = true;
            }
            if (element.category != undefined) {
                isService = true;
            }
            return ((isProduct && subcategory.name.toLowerCase().includes(searchTerm)) ||
                (isService && category.name.toLowerCase().includes(searchTerm)) ||
                (author != null &&
                    author.userName.toLowerCase().includes(searchTerm)) ||
                otherFields.some((item) => Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm))));
        }
        const toReturn = allProducts.filter(checkConditions);
        return toReturn;
    }
    async addFeedbackToProduct(productid, feedbackids, useremail) {
        return await Product_1.default.findByIdAndUpdate(productid, {
            $addToSet: {
                feedbacks: feedbackids,
            },
        });
    }
    async getProducts() {
        return await Product_1.default.find({})
            .populate("author", { userName: 1, email: 1 })
            .populate("subcategory")
            //   .populate({ path: "images", select: "mimetype" })
            .populate("feedback")
            .populate("category")
            .populate("feedbacks");
        // return await this.appfileService.getAllAppFiles();
    }
    // get product
    async getProduct(id) {
        return await Product_1.default.findOne({ _id: id })
            .populate("author", { userName: 1, email: 1 })
            .populate("subcategory")
            // .populate({ path: "images", select: "mimetype" })
            .populate("feedback")
            .populate("category")
            .populate("feedbacks");
    }
    async getProductFeedbacks(userid) {
        const results = await Product_1.default.find({ author: userid })
            .populate("author", { userName: 1, email: 1 })
            .populate("feedback");
        const feedbacks = results.map((result) => {
            const feeds = result["feedbacks"].filter((data) => data.author !== userid);
            return { ...result, feedbacks: feeds };
        });
        return feedbacks;
    }
    async getProductsByUser(userid) {
        return await Product_1.default.find({ author: userid })
            .populate("author", { userName: 1, email: 1 })
            // .populate('subcategory')
            .populate({ path: "images", select: "mimetype" })
            // .populate('category')
            .populate("feedbacks");
        // return await this.appfileService.getAllAppFiles();
    }
    // search for product
    async getProductsByCondition(query) {
        let { name, school, priceMax, priceMin, sortBy, delivery, otherFields, takeCount, pageNo, } = query;
        if (otherFields == undefined)
            otherFields = [];
        const sortedData = sortBy === "Newest"
            ? { timestamps: "descending" } // or { _id: -1 }
            : sortBy === "Highest Price"
                ? { price: 1 }
                : sortBy === "Lowest Price"
                    ? { price: -1 }
                    : { timestamps: "descending" };
        sortBy = sortBy == undefined ? "" : sortBy;
        priceMax = priceMax == undefined ? Number.MAX_SAFE_INTEGER : priceMax;
        priceMin = priceMin == undefined ? 0 : priceMin;
        takeCount = takeCount == undefined ? 10 : takeCount;
        pageNo = pageNo == undefined ? 1 : pageNo;
        const skip = (pageNo - 1) * takeCount;
        const allProducts = (await Product_1.default.find({})
            .limit(takeCount)
            .skip(skip)
            // price: { $gte: priceMin, $lte: priceMax },
            .populate({ path: "author", select: "userName email" })
            .populate({ path: "subcategory", select: "name" })
            .populate({ path: "category", select: "name" })
            //   .populate({ path: "images" })
            .populate("feedbacks")
            .sort(sortedData));
        const isProduct = allProducts.filter((element) => element.subcategory != null || element.subcategory != undefined);
        const isService = allProducts.filter((element) => element.category != null || element.category != undefined);
        const products = isProduct.filter((element) => checkCondition_1.default(element.subcategory.name, name) &&
            checkCondition_1.checkPriceRange(element.price, priceMax, priceMin) &&
            checkCondition_1.default(element.school, school) &&
            checkCondition_1.default(element.delivery, delivery));
        const services = isService.filter((element) => checkCondition_1.default(element.category.name, name) &&
            checkCondition_1.checkPriceRange(element.price, priceMax, priceMin));
        let toReturn = [...products, ...services].flat(Infinity);
        // check other conditions
        if (otherFields.length > 0) {
            toReturn = toReturn.filter((element) => {
                const check = element.otherFields
                    .map((item) => {
                    const condition = Object.keys(item).every((key) => {
                        const position = otherFields.findIndex((field) => {
                            return Object.keys(field).every((key2) => {
                                return key2 == key;
                            });
                        });
                        if (position >= 0) {
                            return checkCondition_1.default(item[key].toString(), otherFields[position][key]);
                        }
                        return false;
                    });
                    return condition;
                })
                    .some((element) => element == true);
                return check;
            });
        }
        return toReturn.sort((a, b) => {
            if (sortBy.toLowerCase() == "lowest price")
                return a.price - b.price;
            if (sortBy.toLowerCase() == "highest price")
                return b.price - a.price;
            return a.updatedAt > b.updatedAt ? 1 : -1;
        });
    }
    // create product
    async createProduct(product, files, userid) {
        const entity = {
            ...product,
            author: "",
            images: [],
            subcategory: "",
            category: "",
        };
        const isProduct = product.subcategoryId != undefined;
        // AUTHOR
        entity.author = userid;
        // Check if product exists
        const exists = await Product_1.default.find({
            title: entity.title,
            author: entity.author,
        });
        if (exists.length > 0)
            throw new exceptions_1.ConflictException("Product already exist");
        // IMAGE
        if (!files || files.length == 0) {
            throw new exceptions_1.BadDataException("you must include images");
        }
        const imageids = await Promise.all([
            ...files.map(async (file) => {
                const appfile = await this.appfileService.addAppFile(file);
                return appfile.id;
            }),
        ]);
        // await Promise.all(imageids);
        entity.images = imageids;
        // SUBCATEGORY
        if (isProduct) {
            const subcategoryExist = await this.subcategoryService.getSubcategory(entity.subcategoryId);
            if (subcategoryExist.length == 0) {
                imageids.forEach(async (id) => await this.appfileService.deleteAppFile(id));
                throw new exceptions_1.BadDataException("subcategory does not exist");
            }
            entity.subcategory = subcategoryExist[0].id;
            delete entity.category;
        }
        else {
            // CATEGORY
            const categoryExist = await this.categoryService.getCategory(entity.categoryId);
            if (categoryExist.length == 0) {
                imageids.forEach(async (id) => await this.appfileService.deleteAppFile(id));
                throw new exceptions_1.BadDataException("category does not exist");
            }
            entity.category = categoryExist[0].id;
            delete entity.subcategory;
        }
        try {
            const product = await Product_1.default.create(entity);
            await this.subcategoryService.addProductToSubcategory(entity.subcategoryId, product.id);
            return product;
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    // update product
    async updateProduct(id, files, product, userid) {
        const entity = {
            ...product,
            subcategory: "",
            category: "",
            images: [],
        };
        // AUTHOR
        entity.author = userid;
        // Check if product exists
        const exists = (await Product_1.default.findOne({
            _id: id,
            author: userid,
        }));
        if (!exists)
            throw new exceptions_1.NotFoundException("product not found");
        //Product
        const subcategoryExist = await this.subcategoryService.getSubcategory(entity.subcategoryId);
        if (subcategoryExist.length == 0) {
            entity.subcategory = exists.subcategoryId;
        }
        else {
            entity.subcategory = subcategoryExist[0].id;
        }
        //Service
        const categoryExist = await this.categoryService.getCategory(entity.categoryId);
        if (categoryExist.length == 0) {
            entity.category = exists.categoryId;
        }
        else {
            entity.category = categoryExist[0].id;
        }
        // IMAGE
        if (files || files.length > 0) {
            const imageids = await Promise.all([
                ...files.map(async (file) => {
                    const appfile = await this.appfileService.addAppFile(file);
                    return appfile.id;
                }),
            ]);
            entity.images = [...entity.images, ...imageids];
        }
        else {
            entity.images = exists.images;
        }
        try {
            const product = await Product_1.default.findByIdAndUpdate(id, entity, {
                new: true,
            });
            return product;
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    // delete product
    async deleteProduct(productid, userid) {
        try {
            // return await Product.deleteMany();
            const product = await Product_1.default.findOne({
                _id: productid,
                author: userid,
            });
            if (product)
                return await product.remove();
            throw new exceptions_1.NotFoundException("product not found");
        }
        catch (error) {
            throw error;
        }
    }
};
ProductService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IAppFileService)),
    __param(1, inversify_1.inject(types_1.default.ISubcategoryService)),
    __param(2, inversify_1.inject(types_1.default.ICategoryService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProductService);
exports.default = ProductService;
//# sourceMappingURL=product.service.js.map