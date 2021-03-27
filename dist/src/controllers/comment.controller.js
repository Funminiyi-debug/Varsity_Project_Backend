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
const multer_1 = __importDefault(require("multer"));
const tsoa_1 = require("tsoa");
const types_1 = __importDefault(require("../types"));
const express_1 = __importDefault(require("express"));
const handleAppExceptions_1 = __importDefault(require("../utils/handleAppExceptions"));
let CommentController = class CommentController extends tsoa_1.Controller {
    constructor(commentService) {
        super();
        this.commentService = commentService;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getComments() {
        try {
            const results = await this.commentService.getComments();
            this.response = {
                statusCode: 200,
                data: results,
            };
            return this.response;
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async getComment(id) {
        try {
            const results = await this.commentService.getComment(id);
            if (results.length > 0) {
                return {
                    statusCode: 200,
                    data: results,
                };
            }
            else {
                return {
                    statusCode: 404,
                    message: "Comment not found",
                };
            }
        }
        catch (error) {
            console.log(error.message);
            if (error.message.search("Cast") != -1) {
                return {
                    statusCode: 404,
                    message: "Comment Found",
                };
            }
            return {
                statusCode: 500,
                message: error.message,
            };
        }
    }
    async createComment(comment, req, res) {
        // await this.handleFile(req);
        try {
            console.log("Dd");
            const results = await this.commentService.createComment(comment, req.files, res.locals.userid);
            return {
                statusCode: 201,
                data: results,
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async updateComment(commentid, comment, res) {
        try {
            const results = await this.commentService.updateComment(commentid, comment, res.locals.userid);
            if (results == null) {
                this.response = {
                    statusCode: 404,
                    message: "Comment not found",
                };
                return this.response;
            }
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
    async deleteComment(id, res) {
        const email = "";
        try {
            const results = await this.commentService.deleteComment(id, res.locals.userid);
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
    async likeComment(commentid, userid) {
        try {
            const results = await this.commentService.likeComment(commentid, userid);
            return {
                statusCode: 200,
                data: results,
                message: "Comment has been liked",
            };
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async shareComment(commentid) {
        try {
            const results = await this.commentService.shareComment(commentid);
            return { statusCode: 200, data: results };
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async handleFile(request) {
        const multerSingle = multer_1.default().single("images");
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, async (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
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
], CommentController.prototype, "getComments", null);
__decorate([
    tsoa_1.Get("{id}")
    // @httpGet("{id}")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComment", null);
__decorate([
    tsoa_1.Post("/"),
    tsoa_1.SuccessResponse("201", "Created"),
    tsoa_1.Response("400", "Bad Data"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    tsoa_1.Put("{commentid}"),
    tsoa_1.SuccessResponse("204", "Updated"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "updateComment", null);
__decorate([
    tsoa_1.Delete("{id}"),
    tsoa_1.SuccessResponse("204", "Deleted"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
__decorate([
    tsoa_1.Patch("/like-comment/{commentid}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Comment not found"),
    __param(0, tsoa_1.Path("commentid")),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "likeComment", null);
__decorate([
    tsoa_1.Patch("/share-comment/{commentid}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Comment not found"),
    __param(0, tsoa_1.Path("commentid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "shareComment", null);
CommentController = __decorate([
    tsoa_1.Route("/comments"),
    tsoa_1.Tags("Comment"),
    __param(0, inversify_1.inject(types_1.default.ICommentService)),
    __metadata("design:paramtypes", [Object])
], CommentController);
exports.default = CommentController;
//# sourceMappingURL=comment.controller.js.map