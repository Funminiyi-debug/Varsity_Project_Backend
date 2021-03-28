"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const containerDI_1 = require("../containerDI");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const types_1 = __importDefault(require("../types"));
const handleResponse_1 = require("../utils/handleResponse");
const multer_1 = __importDefault(require("../config/multer"));
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const product_middleware_1 = require("../middlewares/product.middleware");
const filter_middleware_1 = require("../middlewares/filter.middleware");
const cache_data_1 = require("../utils/cache-data");
const router = express_1.default.Router();
const productService = containerDI_1.container.get(types_1.default.IProductService);
const productController = new product_controller_1.default(productService);
router.get("/", filter_middleware_1.ProductServiceFilter, async (req, res) => {
    const response = await productController.getProducts(req.query);
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.get("/:id", async (req, res) => {
    const response = await productController.getProduct(req.params.id);
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.post("/", [
    multer_1.default.array("images", 4),
    product_middleware_1.formatProductSchema,
    schemaValidator_1.default(validators_1.identifierSchema, validators_1.productSchema),
], async (req, res) => {
    // product.author = res.locals.user;
    const response = await productController.createProduct(req.body, req, res);
    cache_data_1.refreshCache(req.originalUrl);
    return handleResponse_1.handleResponse(res, response);
});
router.put("/:id", multer_1.default.array("images", 4), product_middleware_1.formatProductSchema, schemaValidator_1.default(validators_1.identifierSchema, validators_1.productSchema), async (req, res) => {
    const response = await productController.updateProduct(req.params.id, req.body, req, res);
    cache_data_1.refreshCache(req.originalUrl);
    return handleResponse_1.handleResponse(res, response);
});
router.delete("/:id", schemaValidator_1.default(validators_1.identifierSchema, validators_1.productSchema), async (req, res) => {
    const response = await productController.deleteProduct(req.params.id, res);
    cache_data_1.flushCache();
    return handleResponse_1.handleResponse(res, response);
});
exports.default = router;
//# sourceMappingURL=product.route.js.map