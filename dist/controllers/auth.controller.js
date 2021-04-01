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
const tsoa_1 = require("tsoa");
const VerificationStatus_1 = __importDefault(require("../enums/VerificationStatus"));
let AuthController = class AuthController extends tsoa_1.Controller {
    async login(method) {
        const { verificationStatus, token, email } = method;
        if (!email)
            return {
                statusCode: 400,
                message: "Verify your email account on facebook",
            };
        if (verificationStatus == VerificationStatus_1.default.Verified) {
            return {
                statusCode: 200,
                data: { token },
            };
        }
        else if (verificationStatus == VerificationStatus_1.default.NotVerified) {
            return {
                statusCode: 201,
                data: { token },
            };
        }
        else {
            return {
                statusCode: 403,
                message: "User is restricted",
            };
        }
    }
    async sendSms(request) {
        return {
            statusCode: 0,
            message: "string",
        };
    }
    async sendSmsCode(request) {
        return {
            statusCode: 0,
            message: "string",
        };
    }
    async changeUsername(request) {
        return {
            statusCode: 0,
            message: "string",
        };
    }
};
__decorate([
    tsoa_1.Get("/{method}"),
    tsoa_1.Response("200 response", "Logged In"),
    tsoa_1.Response(201, "User Created"),
    tsoa_1.Response("403", "Account is Restricted"),
    tsoa_1.Response("500", "Server Error"),
    __param(0, tsoa_1.Path("method")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    tsoa_1.Post("/sendsms"),
    tsoa_1.SuccessResponse("200 response", "SMS sent"),
    tsoa_1.Response("400", "Check Number and Try Again"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendSms", null);
__decorate([
    tsoa_1.Post("/validatesmscode"),
    tsoa_1.SuccessResponse("200 response", "Invalid code entered..."),
    tsoa_1.Response("400", "Code verified,  username next"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendSmsCode", null);
__decorate([
    tsoa_1.SuccessResponse("200 response", "Registration Completed"),
    tsoa_1.Response("400", "Username Unavailable"),
    tsoa_1.Post("/username"),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changeUsername", null);
AuthController = __decorate([
    tsoa_1.Route("/auth"),
    tsoa_1.Tags("Authentication")
], AuthController);
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map