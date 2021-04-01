"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const containerDI_1 = require("../containerDI");
const feedback_controller_1 = __importDefault(require("../controllers/feedback.controller"));
const types_1 = __importDefault(require("../types"));
const handleResponse_1 = require("../utils/handleResponse");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const cache_data_1 = require("../utils/cache-data");
const router = express_1.default.Router();
const feedbackService = containerDI_1.container.get(types_1.default.IFeedbackService);
const feedbackController = new feedback_controller_1.default(feedbackService);
router.get('/', async (req, res) => {
    const response = await feedbackController.getFeedbacks();
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.get('/:id', async (req, res) => {
    const response = await feedbackController.getFeedback(req.params.id);
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.post('/', schemaValidator_1.default(validators_1.identifierSchema, validators_1.feedbackSchema), async (req, res) => {
    const response = await feedbackController.createFeedback(req.body, res);
    cache_data_1.refreshCache(req.originalUrl);
    return handleResponse_1.handleResponse(res, response);
});
router.put('/:id', schemaValidator_1.default(validators_1.identifierSchema, validators_1.feedbackSchema), async (req, res) => {
    const response = await feedbackController.updateFeedback(req.params.id, req.body, res);
    cache_data_1.refreshCache(req.originalUrl);
    return handleResponse_1.handleResponse(res, response);
});
router.put('/like-feedback/:id', async (req, res) => {
    const response = await feedbackController.likeFeedback(req.params.id, res.locals.userid);
    return handleResponse_1.handleResponse(res, response);
});
router.delete('/:id', schemaValidator_1.default(validators_1.identifierSchema, validators_1.feedbackSchema), async (req, res) => {
    const response = await feedbackController.deleteFeedback(req.params.id, res);
    cache_data_1.flushCache();
    return handleResponse_1.handleResponse(res, response);
});
exports.default = router;
//# sourceMappingURL=feedback.route.js.map