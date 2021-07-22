import express, { Request, Response } from "express";
import { container } from "../containerDI";
import FeedbackController from "../controllers/feedback.controller";
import { DataResponse } from "../interfaces/DataResponse";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, feedbackSchema } from "../validators";
import { NotificationService } from "../services";
import { cacheData, flushCache, refreshCache } from "../utils/cache-data";
import NotificationController from "../controllers/notification.controller";
import auth from "../middlewares/auth";

const router = express.Router();
const notificationService = container.get<NotificationService>(
  Types.INotificationService
);
const notificationController = new NotificationController(notificationService);

router.get("/", auth.authenticate, async (req: Request, res: Response) => {
  const response: DataResponse = await notificationController.getNotifications(
    res
  );

  return handleResponse(res, response);
});

router.get("/:id", auth.authenticate, async (req: Request, res: Response) => {
  const response: DataResponse = await notificationController.getNotification(
    req.params.id,
    res
  );

  return handleResponse(res, response);
});

router.delete(
  "/:id",
  auth.authenticate,

  validatorMiddleware(identifierSchema, feedbackSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await notificationController.deleteFeedback(
      req.params.id,
      res
    );

    return handleResponse(res, response);
  }
);

export default router;
