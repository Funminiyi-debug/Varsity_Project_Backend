"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("./types"));
const services_1 = require("./services");
const email_service_1 = __importDefault(require("./services/email.service"));
const container = new inversify_1.Container();
exports.container = container;
container.bind(types_1.default.ICategoryService).to(services_1.CategoryService);
container.bind(types_1.default.IProductService).to(services_1.ProductService);
container.bind(types_1.default.IUserService).to(services_1.UserService);
container
    .bind(types_1.default.ISubcategoryService)
    .to(services_1.SubcategoryService);
container.bind(types_1.default.ICommentService).to(services_1.CommentService);
container.bind(types_1.default.IEmailService).to(email_service_1.default);
container.bind(types_1.default.IAppFileService).to(services_1.AppFileService);
container.bind(types_1.default.IFeedbackService).to(services_1.FeedbackService);
container
    .bind(types_1.default.INotificationService)
    .to(services_1.NotificationService);
container.bind(types_1.default.IPostService).to(services_1.PostService);
container.bind(types_1.default.ILikeService).to(services_1.LikeService);
container.bind(types_1.default.IMessageService).to(services_1.MessageService);
//# sourceMappingURL=containerDI.js.map