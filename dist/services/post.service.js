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
const types_1 = __importDefault(require("../types"));
const Post_1 = __importDefault(require("../models/Post"));
const exceptions_1 = require("../exceptions");
const PostType_1 = __importDefault(require("../enums/PostType"));
const PostSortBy_1 = __importDefault(require("../enums/PostSortBy"));
let PostService = class PostService {
    constructor(appfileService) {
        this.appfileService = appfileService;
    }
    // vote on poll type posts
    async votePoll(postid, userid, optionid) {
        const post = await Post_1.default.findById(postid);
        let voters = [];
        let alreadyExist = false;
        const dummy = post.options.map(async (element) => {
            if (element._id.equals(optionid)) {
                const alreadyExists = element.voters.some((val) => val == userid);
                voters = element.voters;
                alreadyExist = alreadyExists;
                // element.votes += 1;
                // element.voters = [...element.voters, userid];
            }
            return element;
        });
        if (!post)
            throw new exceptions_1.NotFoundException('Post not found');
        if (post.postType != PostType_1.default.Poll) {
            throw new exceptions_1.UnprocessedEntityException('You can only vote on a poll');
        }
        if (alreadyExist) {
            throw new exceptions_1.UnprocessedEntityException('User has already voted');
        }
        if (Date.now > post.pollExpiryDate) {
            throw new exceptions_1.UnprocessedEntityException('Poll date has expired');
        }
        const updated = await Post_1.default.findOneAndUpdate({
            _id: postid,
            'options._id': optionid,
        }, {
            $set: {
                'options.$.votes': voters.length + 1,
                'options.$.voters': [...voters, userid],
            },
        }, { new: true });
        console.log(updated);
        return await post.save();
    }
    // like post
    async likePost(postid, userid) {
        const post = await Post_1.default.findById(postid);
        if (!post)
            throw new exceptions_1.NotFoundException('Post not found');
        const like = { liker: userid };
        const exists = post.likes.some((val) => val['liker'] == userid);
        if (exists)
            throw new exceptions_1.UnprocessedEntityException('User has already liked post');
        post.likes = [...post.likes, like];
        return await post.save();
    }
    // share post
    async sharePost(postid) {
        const post = await Post_1.default.findById(postid);
        if (!post)
            throw new exceptions_1.NotFoundException('Post not found');
        post.shares += 1;
        return await post.save();
    }
    //add comment to post
    async addCommentToPost(commentid, postid) {
        let post = (await Post_1.default.findById(postid));
        if (post) {
            post.comments = [commentid, ...post.comments];
            await post.save();
            return true;
        }
        return false;
    }
    //get all posts
    async getPosts() {
        try {
            return await Post_1.default.find({})
                .populate('author', { userName: 1, email: 1 })
                .populate('images')
                .populate('comments');
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    // get one post by id
    async getPost(id) {
        try {
            return await Post_1.default.find({ _id: id })
                .populate('author', { userName: 1, email: 1 })
                .populate('images')
                .populate('comments');
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    // get one post by user
    async getPostsByUser(userid) {
        try {
            return await Post_1.default.find({ author: userid })
                .populate('author', { userName: 1, email: 1 })
                .populate('images')
                .populate('comments');
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getPostsLikedByUser(userid) {
        try {
            return await Post_1.default.find({ 'likes.author': userid })
                .populate('author', { userName: 1, email: 1 })
                .populate('images')
                .populate('comments');
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    // create new post
    async createPost(post, files, userid) {
        const entity = {
            ...post,
            author: '',
            images: [],
        };
        // AUTHOR
        entity.author = userid;
        // Check if post exists
        if (entity.postType == PostType_1.default.Regular) {
            const exists = await Post_1.default.find({
                title: entity.title,
                author: entity.author,
                sector: entity.sector,
            });
            if (exists.length > 0)
                throw new exceptions_1.ConflictException('Post already exist');
        }
        if (entity.postType == PostType_1.default.Poll) {
            const exists = await Post_1.default.find({
                question: entity.question,
                author: entity.author,
                sector: entity.sector,
            });
            entity.options = entity.options.map((option) => {
                return { name: option };
            });
            if (exists.length > 0)
                throw new exceptions_1.ConflictException('Post already exist');
        }
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
        try {
            return await Post_1.default.create(entity);
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    // update previous posts
    async updatePost(postid, post, userid) {
        const entity = {
            ...post,
            author: '',
        };
        // Check if product exists
        const exists = await Post_1.default.find({ _id: postid, author: userid });
        if (!exists)
            throw new exceptions_1.NotFoundException('post not found');
        // AUTHOR
        entity.author = userid;
        try {
            return await Post_1.default.findByIdAndUpdate(postid, entity, {
                new: true,
            });
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    // delete post
    async deletePost(id, userid) {
        try {
            // return await Post.deleteMany();
            const post = (await Post_1.default.find({ _id: id, author: userid }))[0];
            if (post)
                return await post.remove();
            throw new exceptions_1.NotFoundException('post not found');
        }
        catch (error) {
            throw error;
        }
    }
    async getPostByCondition(query) {
        let { takeCount, pageNo } = query;
        takeCount = takeCount == undefined ? 10 : takeCount;
        pageNo = pageNo == undefined ? 1 : pageNo;
        const skip = (pageNo - 1) * takeCount;
        const post = await Post_1.default.find({ sector: query.sector })
            .limit(takeCount)
            .skip(skip)
            .populate('author', { userName: 1, email: 1 })
            .populate('images')
            .populate('comments');
        if (query.sortBy != undefined) {
            post.sort((a, b) => {
                if (query.sortBy.toLowerCase() == PostSortBy_1.default.HighestComment.toLowerCase()) {
                    return b.comments.length - a.comments.length;
                }
                if (query.sortBy.toLowerCase() == PostSortBy_1.default.LowestComment.toLowerCase()) {
                    return a.comments.length - b.comments.length;
                }
                return a.updatedAt > b.updatedAt ? 1 : -1;
            });
        }
        return post;
    }
    async searchPost(searchTerm) {
        const post = await Post_1.default.find({ $text: { $search: searchTerm } })
            .populate('author', { userName: 1, email: 1 })
            .populate('images')
            .populate('comments');
        return post;
    }
};
PostService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IFeedbackService)),
    __metadata("design:paramtypes", [Object])
], PostService);
exports.default = PostService;
//# sourceMappingURL=post.service.js.map