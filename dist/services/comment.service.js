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
const Comment_1 = __importDefault(require("../models/Comment"));
const exceptions_1 = require("../exceptions");
const types_1 = __importDefault(require("../types"));
let CommentService = class CommentService {
    /**
     *
     */
    constructor(postService, appfileService) {
        this.postService = postService;
        this.appfileService = appfileService;
    }
    async getComments() {
        try {
            return await Comment_1.default.find({})
                .populate("comments")
                .populate("commentid")
                .populate({ path: "author", select: "userName email" })
                .populate("images")
                .populate("post");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getComment(id) {
        try {
            return await Comment_1.default.find({ _id: id })
                .populate("comments")
                .populate("commentid")
                .populate({ path: "author", select: "userName email" })
                .populate("images")
                .populate("post");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getCommentsByUser(userid) {
        try {
            return await Comment_1.default.find({ author: userid })
                .populate("comments")
                .populate("commentid")
                .populate({ path: "author", select: "userName email" })
                .populate("images")
                .populate("post");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getCommentsLikedByUser(userid) {
        try {
            return await Comment_1.default.find({ "likes.author": userid })
                .populate("comments")
                .populate("commentid")
                .populate({ path: "author", select: "userName email" })
                .populate("images")
                .populate("post");
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async createComment(request, files, userid) {
        try {
            const entity = {
                ...request,
                post: request.postid,
                images: [],
                author: "",
            };
            entity.author = userid;
            if (files != undefined) {
                // images
                const imageids = await Promise.all([
                    ...files.map(async (file) => {
                        const appfile = await this.appfileService.addAppFile(file);
                        return appfile.id;
                    }),
                ]);
                entity.images = imageids;
            }
            const comment = await Comment_1.default.create(entity);
            const commentAddedToPost = this.postService.addCommentToPost(comment._id, entity.post);
            if (request.commentid != undefined) {
                await Comment_1.default.findByIdAndUpdate(request.commentid, {
                    $push: { comments: request.commentid },
                });
            }
            if (!commentAddedToPost) {
                await comment.remove();
                throw new exceptions_1.ServerErrorException("Unable to add comment to post");
            }
            return comment
                .populate("comments")
                .populate("commentid")
                .populate({ path: "author", select: "userName email" })
                .populate("images")
                .populate("post");
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async updateComment(id, request, userid) {
        try {
            const entity = {
                ...request,
                post: request.postid,
            };
            const exists = (await Comment_1.default.find({ _id: id, author: userid }))[0];
            if (!exists)
                throw new exceptions_1.NotFoundException("comment not found");
            return await Comment_1.default.findByIdAndUpdate(id, entity, { new: true });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteComment(id, userid) {
        try {
            const comment = await Comment_1.default.findOne({ _id: id, author: userid });
            if (!comment)
                throw new exceptions_1.NotFoundException("comment not found");
            return await comment.remove();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async likeComment(commentid, userid) {
        const comment = await Comment_1.default.findById(commentid);
        if (!comment)
            throw new exceptions_1.NotFoundException("comment not found");
        const like = { liker: userid };
        const exists = comment.likes.some((val) => val["liker"] == userid);
        if (exists)
            throw exceptions_1.ConflictException("User has already liked comment");
        comment.likes = [...comment.likes, like];
        return await comment.save();
    }
    async shareComment(commentid) {
        const comment = await Comment_1.default.findById(commentid);
        if (!comment)
            throw new exceptions_1.NotFoundException("Comment not found");
        comment.shares += 1;
        return await comment.save();
    }
};
CommentService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IPostService)),
    __param(1, inversify_1.inject(types_1.default.IAppFileService)),
    __metadata("design:paramtypes", [Object, Object])
], CommentService);
exports.default = CommentService;
//# sourceMappingURL=comment.service.js.map