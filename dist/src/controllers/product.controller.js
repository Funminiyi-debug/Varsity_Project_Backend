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
const express_1 = __importDefault(require("express"));
const handleAppExceptions_1 = __importDefault(require("../utils/handleAppExceptions"));
const formatProduct_Service_1 = __importDefault(require("../utils/formatProduct_Service"));
let ProductsController = class ProductsController extends tsoa_1.Controller {
    constructor(ps) {
        super();
        this.ps = ps;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getProducts(query) {
        // @Query() const searchTerm = query.searchTerm;
        try {
            let results = {};
            if (query.searchTerm != undefined) {
                results = await this.ps.searchProduct(query.searchTerm);
            }
            else if (Object.keys(query).length !== 0) {
                results = await this.ps.getProductsByCondition(query);
            }
            else {
                results = await this.ps.getProducts();
            }
            this.response = {
                statusCode: 200,
                data: formatProduct_Service_1.default(results),
            };
            return this.response;
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async getProduct(id) {
        try {
            const results = await this.ps.getProduct(id);
            if (results.length > 0) {
                return {
                    statusCode: 200,
                    data: formatProduct_Service_1.default(results),
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
            if (error.message.search("Cast") != -1) {
                return {
                    statusCode: 404,
                    message: "Not Found",
                };
            }
            return {
                statusCode: 500,
                message: error.message,
            };
        }
    }
    async createProduct(product, req, res) {
        // await this.handleFile(req);
        try {
            const results = await this.ps.createProduct(product, req.files, res.locals.userid);
            return {
                statusCode: 201,
                data: formatProduct_Service_1.default(results),
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async updateProduct(productid, product, req, res) {
        console.log("controller ran");
        try {
            const results = await this.ps.updateProduct(productid, req.files, product, res.locals.userid);
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async deleteProduct(productid, res) {
        try {
            const results = await this.ps.deleteProduct(productid, res.locals.userid);
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
};
__decorate([
    tsoa_1.Get("/"),
    tsoa_1.SuccessResponse("200", "OK"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    tsoa_1.Get("{id}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    tsoa_1.Post("/"),
    tsoa_1.SuccessResponse("201", "Created"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("409", "product already exists"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    tsoa_1.Put("{productid}"),
    tsoa_1.SuccessResponse("204", "Updated"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Request()),
    __param(3, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    tsoa_1.Delete("{productid}"),
    tsoa_1.SuccessResponse("204", "Deleted"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
ProductsController = __decorate([
    tsoa_1.Route("/products"),
    tsoa_1.Tags("Product"),
    __param(0, inversify_1.inject(types_1.default.IProductService)),
    __metadata("design:paramtypes", [Object])
], ProductsController);
exports.default = ProductsController;
//# sourceMappingURL=product.controller.js.map