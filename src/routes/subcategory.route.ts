import express, { Request, Response } from "express";
import { DataResponse } from "../interfaces/DataResponse";
import { handleResponse } from "../utils/handleResponse";
import { container } from "../containerDI";
import Types from "../types";
import { cacheData } from "../utils/cache-data";
import SubcategoryController from "../controllers/subcategory.controller";
import { SubcategoryService } from "../services";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, subcategorySchema } from "../validators";
import SubCategory from "../models/SubCategory";
import adminOnly from "../middlewares/adminOnly";
import auth from "../middlewares/auth";

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

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await subcategoryController.getSubcategory(
    req.params.id
  );

  return handleResponse(res, response);
});

router.post(
  "/",
  auth.authenticate,

  adminOnly,
  validatorMiddleware(identifierSchema, subcategorySchema),
  async (req: Request, res: Response) => {
    const response: DataResponse =
      await subcategoryController.createSubcategory(req.body);

    return handleResponse(res, response);
  }
);

router.put(
  "/:id",
  auth.authenticate,

  adminOnly,
  validatorMiddleware(identifierSchema, subcategorySchema),
  async (req: Request, res: Response) => {
    const response: DataResponse =
      await subcategoryController.updateSubcategory(req.params.id, req.body);

    return handleResponse(res, response);
  }
);

router.delete(
  "/:id",
  auth.authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    const response: DataResponse =
      await subcategoryController.deleteSubCategory(req.params.id);

    return handleResponse(res, response);
  }
);

router.delete("/", auth.authenticate, adminOnly, async (req, res) => {
  const deleted = await SubCategory.deleteMany();
  return res.status(200).json({ message: "deleted", deleted });
});

export default router;
