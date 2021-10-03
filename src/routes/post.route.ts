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
import { cacheData } from "../utils/cache-data";
import auth from "../middlewares/auth";

const router = express.Router();
const postService = container.get<PostService>(Types.IPostService);
const postController = new PostController(postService);

router.get("/", async (req: Request, res: Response) => {
  const response: DataResponse = await postController.getPosts(req.query);
  cacheData(req.originalUrl, response);
  return handleResponse(res, response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response: DataResponse = await postController.getPost(req.params.id);
  cacheData(req.originalUrl, response);

  return handleResponse(res, response);
});

router.post(
  "/",
  [
    auth.authenticate,

    upload.array("images", 4),
    validatorMiddleware(identifierSchema, postSchema),
  ],
  async (req: Request, res: Response) => {
    // product.author = res.locals.user;
    //console.log(req.body);
    const response: DataResponse = await postController.createPost(
      req.body,
      req,
      res
    );
    cacheData(req.originalUrl, response);
    return handleResponse(res, response);
  }
);

// update all posts
router.put(
  "/:id",
  auth.authenticate,

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

// delete post
router.delete(
  "/:id",
  auth.authenticate,

  validatorMiddleware(identifierSchema, postSchema),
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.deletePost(
      req.params.id,
      res
    );
    return handleResponse(res, response);
  }
);

// vote poll
router.patch(
  "/vote-poll/:id",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.votePoll(
      req.params.id,
      res.locals.userid,
      req.body.optionid
    );

    return handleResponse(res, response);
  }
);

// like  post
router.patch(
  "/like-post/:id",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.likePost(
      req.params.id,
      res.locals.userid
    );

    return handleResponse(res, response);
  }
);

// like  post
router.patch(
  "/share-post/:id",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.sharePost(
      req.params.id
    );

    return handleResponse(res, response);
  }
);
// like  post
router.patch(
  "/report/:postid",
  auth.authenticate,
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.reportPost(
      req.params.postid,
      res
    );

    return handleResponse(res, response);
  }
);

router.post(
  "/approve-post/:postid",
  auth.authenticate,
  auth.admin,
  async (req: Request, res: Response) => {
    const response: DataResponse = await postController.approvePost(
      req.params.postid,
      req.body.approvalStatus
    );

    return handleResponse(res, response);
  }
);
export default router;
