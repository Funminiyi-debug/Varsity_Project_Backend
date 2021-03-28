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
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const exceptions_1 = require("../exceptions");
const types_1 = __importDefault(require("../types"));
let EmailService = class EmailService {
    constructor(productService) {
        this.productService = productService;
    }
    async sendmail(message, receiverMail) {
        // const receiverMail = (await this.productService.getProduct(productid))
        //   .author.email;
        const senderMail = process.env.SENDER_EMAIL;
        return await this.main(message, senderMail, receiverMail);
    }
    async main(message, sender, receiver) {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        // send mail with defined transport object
        await transporter.sendMail({
            from: sender,
            to: receiver,
            subject: "Varsity Feedbacks",
            text: message,
        }, (error, info) => {
            if (error)
                return exceptions_1.ServerErrorException(error);
            else
                return info.messageId;
        });
    }
};
EmailService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IProductService)),
    __metadata("design:paramtypes", [Object])
], EmailService);
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map