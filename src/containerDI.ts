import { Container } from "inversify";
import Types from "./types";
import {
  CategoryService,
  ProductService,
  UserService,
  AppFileService,
  NotificationService,
  SubcategoryService,
  FeedbackService,
  CommentService,
  LikeService,
  PostService,
  MessageService,
} from "./services";
import {
  IUserService,
  IProductService,
  ICategoryService,
  IAppFileService,
  INotificationService,
  ISubcategoryService,
  IFeedbackService,
  ICommentService,
  IPostService,
  ILikeService,
  IMessageService,
  IDashboardService,
} from "./services/interfaces";
import IEmailService from "./services/interfaces/iemail.service";
import EmailService from "./services/email.service";
import DashboardService from "./services/dashboard.service";

const container = new Container();
container.bind<ICategoryService>(Types.ICategoryService).to(CategoryService);
container.bind<IProductService>(Types.IProductService).to(ProductService);
container.bind<IUserService>(Types.IUserService).to(UserService);
container
  .bind<ISubcategoryService>(Types.ISubcategoryService)
  .to(SubcategoryService);
container.bind<ICommentService>(Types.ICommentService).to(CommentService);
container.bind<IEmailService>(Types.IEmailService).to(EmailService);
container.bind<IAppFileService>(Types.IAppFileService).to(AppFileService);
container.bind<IFeedbackService>(Types.IFeedbackService).to(FeedbackService);
container
  .bind<INotificationService>(Types.INotificationService)
  .to(NotificationService);
container.bind<IPostService>(Types.IPostService).to(PostService);
container.bind<ILikeService>(Types.ILikeService).to(LikeService);
container.bind<IMessageService>(Types.IMessageService).to(MessageService);
container.bind<IDashboardService>(Types.IDashboardService).to(DashboardService);
export { container };
