import express, { Request, Response } from "express";
import { container } from "../containerDI";
import PostController from "../controllers/post.controller";
import { DataResponse } from "../interfaces/DataResponse";
import Types from "../types";
import { handleResponse } from "../utils/handleResponse";
import upload from "../config/multer";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, postSchema } from "../validators";
import { PostService } from "../services";

const router = express.Router();
const postService = container.get<PostService>(Types.IPostService);
const postController = new PostController(postService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await postController.getPosts();

  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await postController.getPost(req.params.id);

  return handleResponse(res, response);
});

router.post(
  "/",
  [
    validatorMiddleware(identifierSchema, postSchema),
    // upload.array("images", 4),
  ],
  async (req: Request, res: Response) => {
    // product.author = res.locals.user;
    const response: DataResponse = await postController.createPost(
      req.body,
      res
    );

    return handleResponse(res, response);
  }
);

router.put(
  "/:id",
  validatorMiddleware(identifierSchema, postSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.updatePost(
      req.params.id,
      req.body,
      res
    );

    return handleResponse(res, response);
  }
);

router.delete(
  "/:id",
  validatorMiddleware(identifierSchema, postSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.deletePost(
      req.params.id,
      res
    );
    return handleResponse(res, response);
  }
);

export default router;
