import express, { Request, Response } from "express";
import { container } from "../containerDI";
import FeedbackController from "../controllers/feedback.controller";
import { DataResponse } from "../interfaces/DataResponse";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, feedbackSchema } from "../validators";
import { FeedbackService } from "../services";

const router = express.Router();
const feedbackService = container.get<FeedbackService>(Types.IFeedbackService);
const feedbackController = new FeedbackController(feedbackService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await feedbackController.getFeedbacks();

  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await feedbackController.getFeedback(
    req.params.id
  );

  return handleResponse(res, response);
});

router.post("/", async (req: Request, res: Response) => {
  const response: DataResponse = await feedbackController.createFeedback(
    req.body,
    res
  );

  return handleResponse(res, response);
});

router.put(
  "/:id",
  validatorMiddleware(identifierSchema, feedbackSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await feedbackController.updateFeedback(
      req.params.id,
      req.body,
      res
    );

    return handleResponse(res, response);
  }
);
router.put("/like-feedback/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await feedbackController.likeFeedback(
    req.params.id,
    res.locals.userid
  );

  return handleResponse(res, response);
});

router.delete(
  "/:id",
  validatorMiddleware(identifierSchema, feedbackSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await feedbackController.deleteFeedback(
      req.params.id,
      res
    );
    return handleResponse(res, response);
  }
);

export default router;
