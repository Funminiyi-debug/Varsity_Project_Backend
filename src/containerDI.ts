import { Container } from "inversify";
import CategoryService from "./services/category.service";
import ProductService from "./services/product.service";
import { ICategoryService } from "./services/Icategory.service";
import Types from "./types";

const container = new Container();
container.bind<ICategoryService>(Types.ICategoryService).to(CategoryService);
container.bind<ProductService>(Types.ProductService).to(ProductService);
export { container };
