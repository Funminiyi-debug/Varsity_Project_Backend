import express, { Request, Response } from "express";
import { container } from "../containerDI";
import ProductsController from "../controllers/product.controller";
import { DataResponse } from "../interfaces/DataResponse";
import ProductService from "../services/product.service";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
import upload from "../config/multer";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, productSchema } from "../validators";
import { formatProductSchema } from "../middlewares/product.middleware";
import { ProductServiceFilter } from "../middlewares/filter.middleware";
const router = express.Router();
const productService = container.get<ProductService>(Types.IProductService);
const productController = new ProductsController(productService);

router.get("/", ProductServiceFilter, async (req: Request, res: Response) => {
  const response: DataResponse = await productController.getProducts(req.query);
  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await productController.getProduct(
    req.params.id
  );

  return handleResponse(res, response);
});

router.post(
  "/",
  [
    upload.array("images", 4),
    formatProductSchema,
    validatorMiddleware(identifierSchema, productSchema),
  ],
  async (req: Request, res: Response) => {
    // product.author = res.locals.user;
    const response: DataResponse = await productController.createProduct(
      req.body,
      req,
      res
    );

    return handleResponse(res, response);
  }
);

router.put(
  "/:id",
  upload.array("images", 4),
  formatProductSchema,
  validatorMiddleware(identifierSchema, productSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await productController.updateProduct(
      req.params.id,
      req.body,
      req,
      res
    );

    return handleResponse(res, response);
  }
);

router.delete(
  "/:id",
  validatorMiddleware(identifierSchema, productSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await productController.deleteProduct(
      req.params.id,
      res
    );
    return handleResponse(res, response);
  }
);

export default router;
