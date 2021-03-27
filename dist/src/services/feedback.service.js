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
const Feedback_1 = __importDefault(require("../models/Feedback"));
const exceptions_1 = require("../exceptions");
const types_1 = __importDefault(require("../types"));
const User_1 = __importDefault(require("../models/User"));
let FeedbackService = class FeedbackService {
    /**
     *
     */
    constructor(productService, emailservice, notificationService) {
        this.productService = productService;
        this.emailservice = emailservice;
        this.notificationService = notificationService;
    }
    async likeFeedback(feedbackid, userid) {
        const feedback = await Feedback_1.default.findById(feedbackid);
        if (!feedback)
            throw new exceptions_1.NotFoundException("feedback not found");
        const like = { voter: userid };
        const exists = feedback.likes
            // .map((element) => Object.values(element))
            .some((val) => val["voter"] == userid);
        if (exists) {
            feedback.likes = feedback.likes.filter((item) => item.voter != userid);
            return await feedback.save();
        }
        // ================
        const currentUser = await this.getUser(userid);
        const currentProduct = await this.productService.getProduct(feedback.product);
        const receiverMail = currentProduct.author.email;
        const message = `${currentUser.firstName} liked your post ${currentProduct.title}`;
        await this.emailservice.sendmail(message, receiverMail);
        await this.notificationService.createNotification({
            message,
            user: currentProduct.author._id,
        });
        // if (exists) throw new ConflictException("User has already liked feedback");
        // =====================
        feedback.likes = [...feedback.likes, like];
        return await feedback.save();
    }
    async getFeedbacks() {
        return await Feedback_1.default.find({})
            .populate({ path: "author", select: "userName email" })
            .populate({ path: "product", select: " school title category" })
            .populate("replies");
    }
    async getFeedback(id) {
        try {
            return await Feedback_1.default.find({ _id: id })
                .populate({ path: "author", select: "userName email" })
                .populate({ path: "product", select: " school title category" })
                .populate("replies");
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async getFeedbacksSentByUser(userid) {
        try {
            return await Feedback_1.default.find({ author: userid })
                .populate({ path: "author", select: "userName email" })
                .populate({ path: "product", select: " school title category" })
                .populate("replies");
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async getFeedbacksReceivedByUser(userid) {
        try {
            return await Feedback_1.default.find({ author: { $not: { $in: userid } } })
                .populate({ path: "author", select: "userName email" })
                .populate({ path: "product", select: " school title category" })
                .populate("replies");
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async createFeedback(request, user) {
        const { productid } = request;
        try {
            const entity = {
                ...request,
                author: "",
                product: "",
                feedback: undefined,
            };
            if (request.feedbackid != undefined) {
                entity.feedback = request.feedbackid;
            }
            entity.author = user.userid;
            entity.product = request.productid;
            const feedback = await (await Feedback_1.default.create(entity))
                .populate({ path: "author", select: "userName email" })
                .populate({ path: "product", select: " school title category" })
                .populate("replies");
            if (request.feedbackid != undefined) {
                await Feedback_1.default.findByIdAndUpdate(entity.feedback, {
                    $push: { replies: feedback._id },
                });
            }
            await this.productService.addFeedbackToProduct(entity.productid, feedback._id, "");
            //=========================================================================
            const currentUser = await this.getUser(entity.author);
            const currentProduct = await this.productService.getProduct(entity.productid);
            const receiverMail = currentProduct.author.email;
            const message = `
      ${currentUser.firstName} left a feedback on your post ${currentProduct.title}
        "${request.message}"
      `;
            await this.emailservice.sendmail(message, receiverMail);
            await this.notificationService.createNotification({
                message,
                user: currentProduct.author._id,
            });
            //=========================================================================
            return feedback;
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async updateFeedback(id, entity, userid) {
        try {
            const exists = (await Feedback_1.default.find({ _id: id, author: userid }))[0];
            if (exists)
                throw new exceptions_1.NotFoundException("feedback not found");
            return await Feedback_1.default.findByIdAndUpdate(id, entity, { new: true });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteFeedback(id, userid) {
        try {
            const exists = await Feedback_1.default.find({ _id: id, author: userid })[0];
            if (!exists)
                throw new exceptions_1.NotFoundException("Feedback not found");
            return await exists.remove();
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async getUser(userid) {
        try {
            return await User_1.default.findById(userid);
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
};
FeedbackService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IProductService)),
    __param(1, inversify_1.inject(types_1.default.IEmailService)),
    __param(2, inversify_1.inject(types_1.default.INotificationService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], FeedbackService);
exports.default = FeedbackService;
//# sourceMappingURL=feedback.service.js.map