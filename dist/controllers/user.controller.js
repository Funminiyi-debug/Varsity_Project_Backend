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
const dummydata = require("../../dummydata")();
const tsoa_1 = require("tsoa");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../types"));
const handleAppExceptions_1 = __importDefault(require("../utils/handleAppExceptions"));
// interface VerifyStatusRequest {
//   id: string;
//   status: VStatus;
// }
let UsersController = class UsersController extends tsoa_1.Controller {
    constructor(user) {
        super();
        this.user = user;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getAllUsers() {
        return {
            statusCode: 200,
            data: await this.user.getUsers(),
        };
    }
    async getUser(id) {
        try {
            const user = dummydata.filter((result) => result.userId == id);
            return {
                statusCode: 200,
                data: await this.user.getUser(id),
            };
        }
        catch (error) {
            return { statusCode: 500 };
        }
    }
    async updateVerificationStatus(id, request) {
        const results = await this.user.updateVerificationStatus(id, request.status);
        this.setStatus(201);
        if (results == null) {
            this.response = {
                statusCode: 404,
                message: "User not found",
            };
            return this.response;
        }
        if (results == undefined) {
            this.response = {
                statusCode: 500,
                message: "Something happened",
            };
            return this.response;
        }
        this.response = {
            statusCode: 204,
        };
        return this.response;
    }
    async updateUser(id, request) {
        const results = await this.user.updateUser(id, request);
        this.setStatus(201);
        if (results == null) {
            this.response = {
                statusCode: 404,
                message: "User not found",
            };
            return this.response;
        }
        if (results == undefined) {
            this.response = {
                statusCode: 500,
                message: "Something happened",
            };
            return this.response;
        }
        this.response = {
            statusCode: 204,
        };
        return this.response;
    }
    async deleteUser(id) {
        try {
            await this.user.deleteUser(id);
            return {
                statusCode: 204,
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async savedAd(userid, item) {
        try {
            const data = await this.user.saveAd(item.productid, userid);
            return {
                statusCode: 200,
                data: data,
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
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
    tsoa_1.Get("{id}"),
    tsoa_1.Response("400", "Bad Data"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    tsoa_1.Put("/verify-status/{id}"),
    tsoa_1.SuccessResponse("204", "Updated"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateVerificationStatus", null);
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
], UsersController.prototype, "updateUser", null);
__decorate([
    tsoa_1.Delete("{id}"),
    tsoa_1.SuccessResponse("204", "Updated"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    tsoa_1.Post("save-ad"),
    tsoa_1.SuccessResponse("201", "Created"),
    tsoa_1.Response("422", "Bad Data"),
    __param(0, tsoa_1.Request()), __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "savedAd", null);
UsersController = __decorate([
    tsoa_1.Route("users"),
    tsoa_1.Tags("User"),
    __param(0, inversify_1.inject(types_1.default.IUserService)),
    __metadata("design:paramtypes", [Object])
], UsersController);
exports.default = UsersController;
//# sourceMappingURL=user.controller.js.map