"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const containerDI_1 = require("../containerDI");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
const types_1 = __importDefault(require("../types"));
const handleResponse_1 = require("../utils/handleResponse");
const multer_1 = __importDefault(require("../config/multer"));
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const cache_data_1 = require("../utils/cache-data");
const router = express_1.default.Router();
const postService = containerDI_1.container.get(types_1.default.IPostService);
const postController = new post_controller_1.default(postService);
router.get("/", async (req, res) => {
    const response = await postController.getPosts(req.query);
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.get("/:id", async (req, res) => {
    const response = await postController.getPost(req.params.id);
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.post("/", [
    multer_1.default.array("images", 4),
    schemaValidator_1.default(validators_1.identifierSchema, validators_1.postSchema),
], async (req, res) => {
    // product.author = res.locals.user;
    //console.log(req.body);
    const response = await postController.createPost(req.body, req, res);
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
// update all posts
router.put("/:id", schemaValidator_1.default(validators_1.identifierSchema, validators_1.postSchema), async (req, res) => {
    const response = await postController.updatePost(req.params.id, req.body, res);
    return handleResponse_1.handleResponse(res, response);
});
// delete post
router.delete("/:id", schemaValidator_1.default(validators_1.identifierSchema, validators_1.postSchema), async (req, res) => {
    const response = await postController.deletePost(req.params.id, res);
    return handleResponse_1.handleResponse(res, response);
});
// vote poll
router.patch("/vote-poll/:id", async (req, res) => {
    const response = await postController.votePoll(req.params.id, res.locals.userid, req.body.optionid);
    return handleResponse_1.handleResponse(res, response);
});
// like  post
router.patch("/like-post/:id", async (req, res) => {
    const response = await postController.likePost(req.params.id, res.locals.userid);
    return handleResponse_1.handleResponse(res, response);
});
// like  post
router.patch("/share-post/:id", async (req, res) => {
    const response = await postController.sharePost(req.params.id);
    return handleResponse_1.handleResponse(res, response);
});
exports.default = router;
//# sourceMappingURL=post.route.js.map