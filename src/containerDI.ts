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
export { container };
