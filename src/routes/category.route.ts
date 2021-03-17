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

router.delete("/:id", async (req, res) => {
  // const items = await Category.find();
  // const response = items.map(async (item) => {
  //   try {
  //     // method 1 worked
  //     // come back here later
  //     // let deleted = await Category.deleteOne({ _id: item._id });
  //     // let deleted = await Category.remove({ _id: item._id });

<<<<<<< HEAD
      // method 2
      let deleted = await item.remove();
      return deleted;
    } catch (error) {
      console.log(error);
      console.log("unable to delete");
    }
  });
  flushCache();
  const data = await Promise.all([...response]);
  // Category.deleteOne({ })
  return res.status(200).json({ message: "deleted", response: data });
=======
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
>>>>>>> 6b3e2cb04c91352c60583c8109674fbaa360ecfa

  /**    ********Original**********/
  const response2: DataResponse = await categoryController.deleteCategory(
    req.params.id
  );
  return handleResponse(res, response2);
  /***/
});

export default router;
