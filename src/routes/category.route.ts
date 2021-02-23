import express, { Request, Response } from "express";
import CategoriesController from "../controllers/category.controller";
import { DataResponse } from "../interfaces/DataResponse";
import CategoryService from "../services/category.service";
import { handleResponse } from "../utils/handleResponse";
import { container } from "../containerDI";
import Types from "../types";
import cacheData from "../utils/cache-data";
import ICategory from "../interfaces/entities/ICategory";
import validatorMiddleware from "../middlewares/schemaValidator";
import { categorySchema, identifierSchema } from "../validators";

const router = express.Router();
const categoryService = container.get<CategoryService>(Types.ICategoryService);
const categoryController = new CategoriesController(categoryService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await categoryController.getCategories();
  cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await categoryController.getCategory(
    req.params.id
  );

  return handleResponse(res, response);
});

router.post(
  "/",
  validatorMiddleware(identifierSchema, categorySchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await categoryController.createCategory(
      req.body
    );

    return handleResponse(res, response);
  }
);

router.put(
  "/:id",
  validatorMiddleware(identifierSchema, categorySchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await categoryController.updateCategory(
      req.params.id,
      req.body
    );

    return handleResponse(res, response);
  }
);

export default router;
