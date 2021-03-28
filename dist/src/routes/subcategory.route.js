"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handleResponse_1 = require("../utils/handleResponse");
const containerDI_1 = require("../containerDI");
const types_1 = __importDefault(require("../types"));
const cache_data_1 = require("../utils/cache-data");
const subcategory_controller_1 = __importDefault(require("../controllers/subcategory.controller"));
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const SubCategory_1 = __importDefault(require("../models/SubCategory"));
const router = express_1.default.Router();
const subcategoryService = containerDI_1.container.get(types_1.default.ISubcategoryService);
const subcategoryController = new subcategory_controller_1.default(subcategoryService);
router.get("/", async (req, res) => {
    const response = await subcategoryController.getSubcategories();
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.get("/:id", async (req, res) => {
    const response = await subcategoryController.getSubcategory(req.params.id);
    return handleResponse_1.handleResponse(res, response);
});
router.post("/", schemaValidator_1.default(validators_1.identifierSchema, validators_1.subcategorySchema), async (req, res) => {
    const response = await subcategoryController.createSubcategory(req.body);
    return handleResponse_1.handleResponse(res, response);
});
router.put("/:id", schemaValidator_1.default(validators_1.identifierSchema, validators_1.subcategorySchema), async (req, res) => {
    const response = await subcategoryController.updateSubcategory(req.params.id, req.body);
    return handleResponse_1.handleResponse(res, response);
});
router.delete("/:id", async (req, res) => {
    const response = await subcategoryController.deleteSubCategory(req.params.id);
    return handleResponse_1.handleResponse(res, response);
});
router.delete("/", async (req, res) => {
    const deleted = await SubCategory_1.default.deleteMany();
    return res.status(200).json({ message: "deleted", deleted });
});
exports.default = router;
//# sourceMappingURL=subcategory.route.js.map