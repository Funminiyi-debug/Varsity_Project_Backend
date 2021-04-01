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
let NotificationController = class NotificationController extends tsoa_1.Controller {
    constructor(notificationService) {
        super();
        this.notificationService = notificationService;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getNotifications(res) {
        const results = await this.notificationService.getNotifications(res.locals.userid);
        this.response = {
            statusCode: 200,
            data: results,
        };
        return this.response;
    }
    async getNotification(id, res) {
        try {
            const results = await this.notificationService.getNotification(id, res.locals.userid);
            if (results.length > 0) {
                return {
                    statusCode: 200,
                    data: results,
                };
            }
            else {
                return {
                    statusCode: 404,
                    message: "Notification not found",
                };
            }
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    //   @Post("/")
    //   @SuccessResponse("201", "Created")
    //   @Response<ErrorResponseModel>("400", "Bad Data")
    //   @Response<ErrorResponseModel>("409", "Notification already exists")
    //   public async createNotification(
    //     @Body() notification: INotification,
    //     @Request() res: express.Response
    //   ): Promise<DataResponse> {
    //     // await this.handleFile(req);
    //     try {
    //       const results = await this.notificationService.createNotification(notification, res.locals);
    //       return {
    //         statusCode: 201,
    //         data: results,
    //       };
    //     } catch (error) {
    //       return handleAppExceptions(error);
    //     }
    //   }
    //   @Put("{notificationid}")
    //   @SuccessResponse("204", "Updated")
    //   @Response<ErrorResponseModel>("400", "Bad Data")
    //   @Response<ErrorResponseModel>("404", "Not Found")
    //   public async updateNotification(
    //     @Path() notificationid: string,
    //     @Body() Notification: IFeed,
    //     @Request() res: express.Response
    //   ): Promise<DataResponse> {
    //     try {
    //       const results = await this.notificationService.updateNotification(
    //         notificationid,
    //         Notification,
    //         res.locals.userid
    //       );
    //       if (results == null) {
    //         this.response = {
    //           statusCode: 404,
    //           message: "Notification not found",
    //         };
    //         return this.response;
    //       }
    //       this.response = {
    //         statusCode: 204,
    //       };
    //       return this.response;
    //     } catch (error) {
    //       if (error.message.search("Cast") != -1) {
    //         return {
    //           statusCode: 404,
    //           message: "Not Found",
    //         };
    //       }
    //       return {
    //         statusCode: 500,
    //         message: "Something happened",
    //       };
    //     }
    //   }
    async deleteFeedback(notificationid, res) {
        try {
            const results = await this.notificationService.deleteNotification(notificationid, res.locals.userid);
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            if (error.message.search("Cast") != -1) {
                return {
                    statusCode: 404,
                    message: "Not Found",
                };
            }
            return {
                statusCode: 500,
                message: "Something happened",
            };
        }
    }
};
__decorate([
    tsoa_1.Get("/")
    // @httpGet("/")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    tsoa_1.Get("{id}")
    // @httpGet("{id}")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotification", null);
__decorate([
    tsoa_1.Delete("{notificationid}"),
    tsoa_1.SuccessResponse("204", "Deleted"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteFeedback", null);
NotificationController = __decorate([
    tsoa_1.Route("/notifications"),
    tsoa_1.Tags("Notification"),
    __param(0, inversify_1.inject(types_1.default.INotificationService)),
    __metadata("design:paramtypes", [Object])
], NotificationController);
exports.default = NotificationController;
//# sourceMappingURL=notification.controller.js.map