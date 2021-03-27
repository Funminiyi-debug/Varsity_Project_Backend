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
let PostController = class PostController extends tsoa_1.Controller {
    constructor(ps) {
        super();
        this.ps = ps;
        this.response = {
            statusCode: 500,
            data: [],
        };
    }
    async getPosts(query) {
        let results = {};
        if (query.searchTerm != undefined) {
            results = await this.ps.searchPost(query.searchTerm);
        }
        else if (Object.keys(query).length !== 0) {
            results = await this.ps.getPostByCondition(query);
        }
        else {
            results = await this.ps.getPosts();
        }
        this.response = {
            statusCode: 200,
            data: results,
        };
        return this.response;
    }
    async getPost(id) {
        try {
            const results = await this.ps.getPost(id);
            if (results.length > 0) {
                return {
                    statusCode: 200,
                    data: results,
                };
            }
            else {
                return {
                    statusCode: 404,
                    message: "Post not found",
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
    async createPost(post, req, res) {
        // await this.handleFile(req);
        try {
            const results = await this.ps.createPost(post, req.files, res.locals.userid);
            return {
                statusCode: 201,
                data: results,
            };
        }
        catch (error) {
            return handleAppExceptions_1.default(error);
        }
    }
    async updatePost(postid, post, res) {
        try {
            const results = await this.ps.updatePost(postid, post, res.locals.userid);
            if (results == null) {
                this.response = {
                    statusCode: 404,
                    message: "Post not found",
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
    async deletePost(id, res) {
        const email = "";
        try {
            const results = await this.ps.deletePost(id, res.locals.userid);
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
            return handleAppExceptions_1.default(error);
        }
    }
    async votePoll(postid, userid, optionid) {
        try {
            const results = await this.ps.votePoll(postid, userid, optionid);
            return { statusCode: 200, data: results, message: "Vote Succeeded" };
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async likePost(postid, userid) {
        try {
            const results = await this.ps.likePost(postid, userid);
            return { statusCode: 200, data: results, message: "Post has been liked" };
        }
        catch (error) {
            console.log(error);
            return handleAppExceptions_1.default(error);
        }
    }
    async sharePost(postid) {
        try {
            const results = await this.ps.sharePost(postid);
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
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    tsoa_1.Get("{id}")
    // @httpGet("{id}")
    ,
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Not Found"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPost", null);
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
], PostController.prototype, "createPost", null);
__decorate([
    tsoa_1.Put("{postid}"),
    tsoa_1.SuccessResponse("204", "Updated"),
    tsoa_1.Response("400", "Bad Data"),
    tsoa_1.Response("404", "Not Found"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
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
], PostController.prototype, "deletePost", null);
__decorate([
    tsoa_1.Patch("/vote-poll/{postid}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Poll not found"),
    __param(0, tsoa_1.Path("postid")),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "votePoll", null);
__decorate([
    tsoa_1.Patch("/like-post/{postid}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Post not found"),
    __param(0, tsoa_1.Path("postid")),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "likePost", null);
__decorate([
    tsoa_1.Patch("/share-post/{postid}"),
    tsoa_1.SuccessResponse("200", "OK"),
    tsoa_1.Response("404", "Post not found"),
    __param(0, tsoa_1.Path("postid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "sharePost", null);
PostController = __decorate([
    tsoa_1.Route("/posts"),
    tsoa_1.Tags("Post"),
    __param(0, inversify_1.inject(types_1.default.IPostService)),
    __metadata("design:paramtypes", [Object])
], PostController);
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map