import express, { Request, Response } from "express";
import CategoriesController from "../controllers/category.controller";
import { DataResponse } from "../interfaces/DataResponse";
import CategoryService from "../services/CategoryService";
import handleResponse from "../utils/response";

const router = express.Router();
const categoryController = new CategoriesController(new CategoryService());

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
