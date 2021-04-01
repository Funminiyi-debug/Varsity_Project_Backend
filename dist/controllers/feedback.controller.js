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
let FeedbackController = class FeedbackController extends tsoa_1.Controller {
    constructor(fb) {
        super();
        this.fb = fb;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getFeedbacks() {
        const results = await this.fb.getFeedbacks();
        this.response = {
            statusCode: 200,
            data: results,
        };
        return this.response;
    }
    async getFeedback(id) {
        try {
            const results = await this.fb.getFeedback(id);
            if (results.length > 0) {
                return {
                    statusCode: 200,
                    data: results,
                };
            }
            else {
                return {
                    statusCode: 404,
                    message: 'Feedback not found',
                };
            }
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async createFeedback(feedback, res) {
        // await this.handleFile(req);
        try {
            const results = await this.fb.createFeedback(feedback, res.locals);
            return {
                statusCode: 201,
                data: results,
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async updateFeedback(feedbackid, feedback, res) {
        try {
            const results = await this.fb.updateFeedback(feedbackid, feedback, res.locals.userid);
            if (results == null) {
                this.response = {
                    statusCode: 404,
                    message: 'Feedback not found',
                };
                return this.response;
            }
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            if (error.message.search('Cast') != -1) {
                return {
                    statusCode: 404,
                    message: 'Not Found',
                };
            }
            return {
                statusCode: 500,
                message: 'Something happened',
            };
        }
    }
    async likeFeedback(feedbackid, userid) {
        try {
            const results = await this.fb.likeFeedback(feedbackid, userid);
            return {
                statusCode: 200,
                data: results,
            };
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async deleteFeedback(feedbackid, res) {
        try {
            const results = await this.fb.deleteFeedback(feedbackid, res.locals.userid);
            this.response = {
                statusCode: 204,
            };
            return this.response;
        }
        catch (error) {
            if (error.message.search('Cast') != -1) {
                return {
                    statusCode: 404,
                    message: 'Not Found',
                };
            }
            return {
                statusCode: 500,
                message: 'Something happened',
            };
        }
    }
};
__decorate([
    tsoa_1.Get('/')
    // @httpGet("/")
    ,
    tsoa_1.SuccessResponse('200', 'OK'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedbacks", null);
__decorate([
    tsoa_1.Get('{id}')
    // @httpGet("{id}")
    ,
    tsoa_1.SuccessResponse('200', 'OK'),
    tsoa_1.Response('404', 'Not Found'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "getFeedback", null);
__decorate([
    tsoa_1.Post('/'),
    tsoa_1.SuccessResponse('201', 'Created'),
    tsoa_1.Response('400', 'Bad Data'),
    tsoa_1.Response('409', 'feedback already exists'),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "createFeedback", null);
__decorate([
    tsoa_1.Put('{feedbackid}'),
    tsoa_1.SuccessResponse('204', 'Updated'),
    tsoa_1.Response('400', 'Bad Data'),
    tsoa_1.Response('404', 'Not Found'),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "updateFeedback", null);
__decorate([
    tsoa_1.Put('/like-feedback/{feedbackid}'),
    tsoa_1.SuccessResponse('200', 'Success'),
    tsoa_1.Response('404', 'Not found'),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "likeFeedback", null);
__decorate([
    tsoa_1.Delete('{feedbackid}'),
    tsoa_1.SuccessResponse('204', 'Deleted'),
    tsoa_1.Response('400', 'Bad Data'),
    tsoa_1.Response('404', 'Not Found'),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "deleteFeedback", null);
FeedbackController = __decorate([
    tsoa_1.Route('/feedbacks'),
    tsoa_1.Tags('Feedback'),
    __param(0, inversify_1.inject(types_1.default.IFeedbackService)),
    __metadata("design:paramtypes", [Object])
], FeedbackController);
exports.default = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map