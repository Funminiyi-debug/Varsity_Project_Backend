"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const containerDI_1 = require("../containerDI");
const types_1 = __importDefault(require("../types"));
const handleResponse_1 = require("../utils/handleResponse");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
const router = express_1.default.Router();
const notificationService = containerDI_1.container.get(types_1.default.INotificationService);
const notificationController = new notification_controller_1.default(notificationService);
router.get("/", async (req, res) => {
    const response = await notificationController.getNotifications(res);
    return handleResponse_1.handleResponse(res, response);
});
router.get("/:id", async (req, res) => {
    const response = await notificationController.getNotification(req.params.id, res);
    return handleResponse_1.handleResponse(res, response);
});
router.delete("/:id", schemaValidator_1.default(validators_1.identifierSchema, validators_1.feedbackSchema), async (req, res) => {
    const response = await notificationController.deleteFeedback(req.params.id, res);
    return handleResponse_1.handleResponse(res, response);
});
exports.default = router;
//# sourceMappingURL=notification.route.js.map