import express, { Request, Response } from "express";
import auth from "../middlewares/auth";
import { DataResponse } from "../interfaces/DataResponse";
import { handleResponse } from "../utils/handleResponse";
import { refreshCache } from "../utils/cache-data";
import StaticService from "../services/static.service";
import Types from "../types";
import StaticController from "../controllers/static.controller";
import { container } from "../containerDI";
import StaticPageStatus from "../enums/StaticPageStatus";
import IStaticPage from "../interfaces/entities/StaticPage";

const router = express.Router();
const statics = container.get<StaticService>(Types.IStaticService);
const staticController = new StaticController(statics);

router.post(
  "/",
  auth.authenticate,
  auth.admin,
  async (req: Request, res: Response) => {
    const response: DataResponse = await staticController.createStaticPage(
      req.body as IStaticPage
    );

    refreshCache(req.originalUrl);
    return handleResponse(res, response);
  }
);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await staticController.getStaticPages(
    req.query.status as StaticPageStatus
  );
  //   cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await staticController.getStaticPage(
    req.params.id
  );
  //   cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await staticController.deleteStaticPage(
    req.params.id
  );
  //   cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

router.put("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await staticController.updateStaticPage(
    req.params.id,
    req.body as IStaticPage
  );
  //   cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

export default router;
