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
  PostService,
  ServiceService,
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
  IServiceService,
} from "./services/interfaces";

const container = new Container();
container.bind<ICategoryService>(Types.ICategoryService).to(CategoryService);
container.bind<IProductService>(Types.IProductService).to(ProductService);
container.bind<IUserService>(Types.IUserService).to(UserService);
container
  .bind<ISubcategoryService>(Types.ISubcategoryService)
  .to(SubcategoryService);
container.bind<ICommentService>(Types.ICommentService).to(CommentService);
container.bind<IAppFileService>(Types.IAppFileService).to(AppFileService);
container.bind<IFeedbackService>(Types.IFeedbackService).to(FeedbackService);
container
  .bind<INotificationService>(Types.INotificationService)
  .to(NotificationService);
container.bind<IPostService>(Types.IPostService).to(PostService);
container.bind<IServiceService>(Types.IServiceService).to(ServiceService);
export { container };
