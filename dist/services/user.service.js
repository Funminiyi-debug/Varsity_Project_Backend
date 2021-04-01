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
const User_1 = __importDefault(require("../models/User"));
const inversify_1 = require("inversify");
const exceptions_1 = require("../exceptions");
const UnauthorizedException_1 = __importDefault(require("../exceptions/UnauthorizedException"));
const types_1 = __importDefault(require("../types"));
const Product_1 = __importDefault(require("../models/Product"));
let UserService = class UserService {
    constructor(postService, commentService, feedbackService, productService) {
        this.postService = postService;
        this.commentService = commentService;
        this.feedbackService = feedbackService;
        this.productService = productService;
    }
    async getUsers() {
        try {
            return await User_1.default.find({}).populate('savedAds');
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async updateUser(id, entity) {
        try {
            return await User_1.default.findByIdAndUpdate(id, entity);
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async updateVerificationStatus(id, status) {
        try {
            return await User_1.default.findByIdAndUpdate(id, {
                $set: { verificationStatus: status },
            });
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async getUser(userid) {
        try {
            const user = await (await User_1.default.findById(userid)).toObject();
            const userProfileData = await this.getUserProfileDetails(userid);
            return {
                ...user,
                ...userProfileData,
            };
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getUserByCondition(query) {
        try {
            return await User_1.default.find(query);
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async getByEmail(email) {
        try {
            const user = await User_1.default.findOne({ email });
            return user;
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async deleteUser(id) {
        try {
            return await (await User_1.default.findById(id)).remove();
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async saveAd(productid, userid) {
        try {
            const user = await this.getUser(userid);
            if (!user)
                throw new UnauthorizedException_1.default('You have to be logged In');
            const product = await Product_1.default.findById(productid);
            if (!product)
                throw new exceptions_1.NotFoundException('ad not found');
            const savedAd = await User_1.default.findByIdAndUpdate(user._id, {
                $addToSet: { savedAds: productid },
            });
            return await savedAd.save();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    //user profiles @dami
    async getUserProfileDetails(userid) {
        const userPosts = await this.postService.getPostsByUser(userid);
        const userLikesOnPost = await this.postService.getPostsLikedByUser(userid);
        const usersCommentsOnPost = await this.commentService.getCommentsByUser(userid);
        const userFeedbacks = await this.feedbackService.getFeedbacksSentByUser(userid);
        const userProducts = await this.productService.getProductsByUser(userid);
        // const allOtherFeedbacks = await this.feedbackService.getFeedbacksReceivedByUser(
        //   userid,
        // )
        const receivedFeedbacks = await this.productService.getProductFeedbacks(userid);
        return {
            userProducts,
            userPosts,
            userLikesOnPost,
            usersCommentsOnPost,
            userFeedbacks,
            receivedFeedbacks,
        };
    }
};
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IPostService)),
    __param(1, inversify_1.inject(types_1.default.ICommentService)),
    __param(2, inversify_1.inject(types_1.default.IFeedbackService)),
    __param(3, inversify_1.inject(types_1.default.IProductService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserService);
exports.default = UserService;
//# sourceMappingURL=user.service.js.map