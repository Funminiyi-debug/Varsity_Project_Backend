import { Container } from "inversify";
import CategoryService from "./services/CategoryService";
import ProductService from "./services/ProductService";
import { ICategoryService } from "./services/ICategoryService";
import Types from "./types";

const container = new Container();
container.bind<ICategoryService>(Types.ICategoryService).to(CategoryService);
container.bind<ProductService>(Types.ProductService).to(ProductService);
export { container };
