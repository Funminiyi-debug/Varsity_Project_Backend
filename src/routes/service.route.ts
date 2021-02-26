import express, { Request, Response } from "express";
import { container } from "../containerDI";
import ServicesController from "../controllers/service.controller";
import { DataResponse } from "../interfaces/DataResponse";
import ServiceService from "../services/service.service";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
import upload from "../config/multer";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, serviceSchema } from "../validators";

const router = express.Router();
const serviceService = container.get<ServiceService>(Types.IServiceService);
const serviceController = new ServicesController(serviceService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await serviceController.getServices();

  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await serviceController.getService(
    req.params.id
  );

  return handleResponse(res, response);
});

router.post(
  "/",
  [
    validatorMiddleware(identifierSchema, serviceSchema),
    upload.array("images", 4),
  ],
  async (req: Request, res: Response) => {
    // product.author = res.locals.user;
    const response: DataResponse = await serviceController.createService(
      req.body,
      req,
      res
    );

    return handleResponse(res, response);
  }
);

router.put(
  "/:id",
  validatorMiddleware(identifierSchema, serviceSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await serviceController.updateService(
      req.params.id,
      req.body,
      req,
      res.locals.email
    );

    return handleResponse(res, response);
  }
);

router.delete(
  "/:id",
  validatorMiddleware(identifierSchema, serviceSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await serviceController.deleteService(
      req.params.id,
      res
    );
    return handleResponse;
  }
);

export default router;