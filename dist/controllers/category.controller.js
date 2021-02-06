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
const tsoa_1 = require("tsoa");
const CategoryService_1 = __importDefault(require("../services/CategoryService"));
let CategoriesController = class CategoriesController extends tsoa_1.Controller {
    constructor(cs) {
        super();
        this.cs = cs;
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.cs.getCategories();
            const response = {
                statusCode: 200,
                data: results,
            };
            return response;
        });
    }
    getCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.cs.getCategory(id);
            const response = {
                statusCode: 500,
                data: [],
            };
            if (results.length > 0) {
                response.statusCode = 200;
                response.data = results;
            }
            else {
                response.statusCode = 404;
                response.data = null;
            }
            return response;
        });
    }
};
__decorate([
    tsoa_1.Get("/"),
    tsoa_1.SuccessResponse("200", "OK"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
__decorate([
    tsoa_1.Get("{id}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategory", null);
CategoriesController = __decorate([
    tsoa_1.Route("/categories"),
    tsoa_1.Tags("Category"),
    __metadata("design:paramtypes", [CategoryService_1.default])
], CategoriesController);
exports.default = CategoriesController;
//# sourceMappingURL=category.controller.js.map