import express, { Request, Response } from "express";
import { container } from "../containerDI";
import ProductsController from "../controllers/product.controller";
import { DataResponse } from "../interfaces/DataResponse";
import ProductService from "../services/product.service";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
const router = express.Router();
const productService = container.get<ProductService>(Types.IProductService);
const productController = new ProductsController(productService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await productController.getProducts();

  return handleResponse(res, response);
});
router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await productController.getProduct(
    req.params.id
  );

  return handleResponse(res, response);
});

router.post("/", async (req: Request, res: Response) => {
  // product.author = res.locals.user;
  const response: DataResponse = await productController.createProduct(
    req.body,
    res
  );

  return handleResponse(res, response);
});

router.put("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await productController.updateProduct(
    req.params.id,
    req.body,
    req
  );

  return handleResponse(res, response);
});

export default router;
