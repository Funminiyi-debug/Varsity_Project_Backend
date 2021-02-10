import express, { Request, Response } from "express";
import CategoriesController from "../controllers/category.controller";
import { DataResponse } from "../interfaces/DataResponse";
import CategoryService from "../services/CategoryService";
import handleResponse from "../utils/response";
import { container } from "../containerDI";
import Types from "../types";
const router = express.Router();
const categoryService = container.get<CategoryService>(Types.ICategoryService);

const categoryController = new CategoriesController(categoryService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await categoryController.getCategories();

  return res.status(response.statusCode).json({
    success: true,
    payload: response.data,
  });
});
router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await categoryController.getCategory(
    req.params.id
  );

  return res.status(response.statusCode).json({
    success: true,
    payload: response.data,
  });
});

export default router;
