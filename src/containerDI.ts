import { Container } from "inversify";
import CategoryService from "./services/category.service";
import ProductService from "./services/product.service";
import { ICategoryService } from "./services/icategory.service";
import Types from "./types";
import { IProductService } from "./services/iproduct.service";

const container = new Container();
container.bind<ICategoryService>(Types.ICategoryService).to(CategoryService);
container.bind<IProductService>(Types.IProductService).to(ProductService);
export { container };
