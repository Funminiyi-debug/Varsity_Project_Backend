import express, { Request, Response } from "express";
import CategoriesController from "../controllers/category.controller";
import { DataResponse } from "../interfaces/DataResponse";
import CategoryService from "../services/category.service";
import { handleResponse } from "../utils/handleResponse";
import { container } from "../containerDI";
import Types from "../types";
import atob from "atob";
import { cacheData, flushCache, refreshCache } from "../utils/cache-data";
import ICategory from "../interfaces/entities/ICategory";
import validatorMiddleware from "../middlewares/schemaValidator";
import { categorySchema, identifierSchema } from "../validators";
import Category from "../models/Category";
import adminOnly from "../middlewares/adminOnly";
import auth from "../middlewares/auth";

const router = express.Router();
const categoryService = container.get<CategoryService>(Types.ICategoryService);
const categoryController = new CategoriesController(categoryService);

router.get("/", async (req: Request, res: Response) => {
  if (req.query.name != undefined) {
    const category = await Category.findOne({
      name: atob(req.query.name as string), //req.query.name, //atob(req.query.name as string),
    });
    return res.status(200).json({ success: true, payload: category });
  }
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
  auth.authenticate,
  auth.superadmin,
  // validatorMiddleware(identifierSchema, categorySchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await categoryController.createCategory(
      req.body
    );

    refreshCache(req.originalUrl);
    return handleResponse(res, response);
  }
);

router.put(
  "/:id",
  auth.authenticate,

  adminOnly,
  validatorMiddleware(identifierSchema, categorySchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await categoryController.updateCategory(
      req.params.id,
      req.body
    );

    refreshCache(req.originalUrl);

    return handleResponse(res, response);
  }
);

router.delete("/:id", auth.authenticate, auth.superadmin, async (req, res) => {
  // const items = await Category.find();
  // const response = items.map(async (item) => {
  //   try {
  //     // method 1 worked
  //     // come back here later
  //     // let deleted = await Category.deleteOne({ _id: item._id });
  //     // let deleted = await Category.remove({ _id: item._id });

  //     // method 2
  //     let deleted = await item.remove();
  //     return deleted;
  //   } catch (error) {
  //     console.log(error);
  //     console.log("unable to delete");
  //   }
  // });

  // const data = await Promise.all([...response]);
  // // Category.deleteOne({ })
  // return res.status(200).json({ message: "deleted", response: data });

  /**    ********Original**********/
  const response2: DataResponse = await categoryController.deleteCategory(
    req.params.id
  );
  return handleResponse(res, response2);
  flushCache();
  /***/
});

export default router;
