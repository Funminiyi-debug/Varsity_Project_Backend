import express, { Request, Response } from "express";
import { container } from "../containerDI";
import SubcategoryController from "../controllers/subcategory.controller";
import { DataResponse } from "../interfaces/DataResponse";
import { SubcategoryService } from "../services";
import Types from "../types";
import cacheData from "../utils/cache-data";
import { handleResponse } from "../utils/handleResponse";
const router = express.Router();
const subcategoryService = container.get<SubcategoryService>(
  Types.ISubcategoryService
);

const subcategoryController = new SubcategoryController(subcategoryService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await subcategoryController.getSubcategories();
  cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

export default router;
