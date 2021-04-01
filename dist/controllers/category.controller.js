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
const tsoa_1 = require("tsoa");
const types_1 = __importDefault(require("../types"));
let CategoriesController = 
// @controller("/categories")
class CategoriesController extends tsoa_1.Controller {
    constructor(cs) {
        super();
        this.cs = cs;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    /**
     * Get all categories
     *
     */
    async getCategories() {
        const results = await this.cs.getCategories();
        this.response = {
            statusCode: 200,
            data: results,
        };
        return this.response;
    }
    async getCategory(id) {
        const results = await this.cs.getCategory(id);
        if (results.length > 0) {
            this.response.statusCode = 200;
            this.response.data = results;
        }
        else {
            this.response.statusCode = 404;
            this.response.message = "Category not found";
        }
        return this.response;
    }
    async createCategory(category) {
        console.log("from user", category);
        try {
            if (!category.name || !category.categoryType) {
                return {
                    statusCode: 400,
                    message: "Please fill all fields",
                };
            }
            const results = await this.cs.createCategory(category);
            if (results == null) {
                this.response = {
                    statusCode: 409,
                    message: "Category already exists",
                };
                return this.response;
            }
            this.response = {
                statusCode: 201,
                data: results,
            };
        }
        catch (error) {
            console.log(error);
            this.response = {
                statusCode: 500,
                message: error.message,
            };
        }
        return this.response;
    }
    async updateCategory(id, category) {
        try {
            const results = await this.cs.updateCategory(id, category);
            if (results == null) {
                this.response = {
                    statusCode: 404,
                    message: "Category not found",
                };
                return this.response;
            }
            this.response = {
                statusCode: 204,
            };
        }
        catch (error) {
            console.log(error);
            this.response = {
                statusCode: 500,
                message: error.message,
            };
        }
        return this.response;
    }
    async deleteCategory(id) {
        try {
            await this.cs.deleteCategory(id);
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            return {
                statusCode: 500,
                message: "Cannot delete Caategory",
            };
        }
    }
};
__decorate([
    tsoa_1.Get("/")
    // @httpGet("/")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
__decorate([
    tsoa_1.Get("{id}")
    // @httpGet("{id}")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategory", null);
__decorate([
    tsoa_1.Post("/"),
    tsoa_1.SuccessResponse("201", "Created"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("409", "Category already exists"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "createCategory", null);
__decorate([
    tsoa_1.Put("{id}"),
    tsoa_1.SuccessResponse("204", "Updated"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
__decorate([
    tsoa_1.Delete("{id}"),
    tsoa_1.SuccessResponse("204", "Deleted"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategory", null);
CategoriesController = __decorate([
    tsoa_1.Route("/categories"),
    tsoa_1.Tags("Category")
    // @controller("/categories")
    ,
    __param(0, inversify_1.inject(types_1.default.ICategoryService)),
    __metadata("design:paramtypes", [Object])
], CategoriesController);
exports.default = CategoriesController;
//# sourceMappingURL=category.controller.js.map