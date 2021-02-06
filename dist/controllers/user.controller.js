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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dummydata = require("../../dummydata")();
const tsoa_1 = require("tsoa");
// import ErrorResponseModel from "../interfaces/ErrorResponseModel";
let UsersController = class UsersController extends tsoa_1.Controller {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                statusCode: 200,
                data: dummydata,
            };
        });
    }
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201);
            return Promise.resolve();
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = dummydata.filter((result) => result.userId == id);
            return {
                statusCode: 200,
                data: user,
            };
        });
    }
};
__decorate([
    tsoa_1.Get("/")
    // to put other responses
    ,
    tsoa_1.Response("400", "Bad Data"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    tsoa_1.SuccessResponse("201", "Created"),
    tsoa_1.Post("/"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    tsoa_1.Get("{id}"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
UsersController = __decorate([
    tsoa_1.Route("users"),
    tsoa_1.Tags("User")
], UsersController);
exports.default = UsersController;
//# sourceMappingURL=user.controller.js.map