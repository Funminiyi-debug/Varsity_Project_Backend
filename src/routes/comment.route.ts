import express, { Request, Response } from "express";
import { container } from "../containerDI";
import CommentController from "../controllers/comment.controller";
import { DataResponse } from "../interfaces/DataResponse";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
import upload from "../config/multer";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, postSchema } from "../validators";
import { CommentService } from "../services";
import { cacheData } from "../utils/cache-data";
import auth from "../middlewares/auth";

const router = express.Router();
const commentService = container.get<CommentService>(Types.ICommentService);
const commentController = new CommentController(commentService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await commentController.getComments();
  cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await commentController.getComment(
    req.params.id
  );
  cacheData(req.originalUrl, response);

  return handleResponse(res, response);
});

router.post(
  "/",
  auth.authenticate,
  [upload.array("images", 4)],
  async (req: Request, res: Response) => {
    // product.author = res.locals.user;
    //console.log(req.body);
    const response: DataResponse = await commentController.createComment(
      req.body,
      req,
      res
    );
    cacheData(req.originalUrl, response);
    return handleResponse(res, response);
  }
);

// update all posts
router.put("/:id", auth.authenticate, async (req: Request, res: Response) => {
  const response: DataResponse = await commentController.updateComment(
    req.params.id,
    req.body,
    res
  );

  return handleResponse(res, response);
});

// delete post
router.delete(
  "/:id",
  auth.authenticate,

  validatorMiddleware(identifierSchema, postSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await commentController.deleteComment(
      req.params.id,
      res
    );
    return handleResponse(res, response);
  }
);

// like  post
router.patch(
  "/like-comment/:id",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await commentController.likeComment(
      req.params.id,
      res.locals.userid
    );

    return handleResponse(res, response);
  }
);

// share  post
router.patch(
  "/share-comment/:id",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await commentController.shareComment(
      req.params.id
    );

    return handleResponse(res, response);
  }
);

export default router;
