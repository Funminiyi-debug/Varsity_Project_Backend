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
const handleAppExceptions_1 = __importDefault(require("../utils/handleAppExceptions"));
let SubcategoryController = class SubcategoryController extends tsoa_1.Controller {
    constructor(subcategoryService) {
        super();
        this.subcategoryService = subcategoryService;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getSubcategories() {
        const results = await this.subcategoryService.getSubcategories();
        this.response = {
            statusCode: 200,
            data: results,
        };
        return this.response;
    }
    async getSubcategory(id) {
        try {
            const results = await this.subcategoryService.getSubcategory(id);
            if (results.length > 0) {
                return {
                    statusCode: 200,
                    data: results,
                };
            }
            else {
                return {
                    statusCode: 404,
                    message: "Product not found",
                };
            }
        }
        catch (error) {
            console.log(error.message);
            return handleAppExceptions_1.default(error);
        }
    }
    async createSubcategory(subcategory) {
        // await this.handleFile(req);
        console.log(subcategory);
        try {
            const results = await this.subcategoryService.createSubcategory(subcategory);
            return {
                statusCode: 201,
                data: results,
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async updateSubcategory(id, subcategory) {
        try {
            const results = await this.subcategoryService.updateSubcategory(id, subcategory);
            if (results == null) {
                this.response = {
                    statusCode: 404,
                    message: "Product not found",
                };
                //added by dami
                return this.response;
            }
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async deleteSubCategory(id) {
        try {
            const result = await this.subcategoryService.deleteSubcategory(id);
            this.response = {
                statusCode: 204,
            };
            if (result == null) {
                this.response = {
                    statusCode: 404,
                    message: "Subcategory not found",
                };
            }
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
    tsoa_1.Get("/"),
    tsoa_1.SuccessResponse("200", "OK"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "getSubcategories", null);
__decorate([
    tsoa_1.Get("{id}")
    // @httpGet("{id}")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "getSubcategory", null);
__decorate([
    tsoa_1.Post("/"),
    tsoa_1.SuccessResponse("201", "Created"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("409", "product already exists"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "createSubcategory", null);
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
], SubcategoryController.prototype, "updateSubcategory", null);
__decorate([
    tsoa_1.Delete("{id}"),
    tsoa_1.SuccessResponse("204", "Deleted"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoryController.prototype, "deleteSubCategory", null);
SubcategoryController = __decorate([
    tsoa_1.Route("/subcategories"),
    tsoa_1.Tags("Subcategory"),
    __param(0, inversify_1.inject(types_1.default.ISubcategoryService)),
    __metadata("design:paramtypes", [Object])
], SubcategoryController);
exports.default = SubcategoryController;
//# sourceMappingURL=subcategory.controller.js.map