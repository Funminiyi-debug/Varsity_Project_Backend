import express, { Request, Response } from "express";
import { DataResponse } from "../interfaces/DataResponse";
import { handleResponse } from "../utils/handleResponse";
import { container } from "../containerDI";
import Types from "../types";
import DashboardController from "../controllers/dashboard.controller";
import DashboardService from "../services/dashboard.service";
import adminOnly from "../middlewares/adminOnly";
import auth from "../middlewares/auth";

const router = express.Router();
const dashboardService = container.get<DashboardService>(
  Types.IDashboardService
);
const categoryController = new DashboardController(dashboardService);

router.get(
  "/metrics",
  auth.authenticate,
  adminOnly,
  async (req: Request, res: Response) => {
    const response: DataResponse = await categoryController.getMetrics();
    return handleResponse(res, response);
  }
);

export default router;
