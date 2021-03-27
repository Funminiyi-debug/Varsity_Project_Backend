"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const handleResponse_1 = require("../utils/handleResponse");
const containerDI_1 = require("../containerDI");
const types_1 = __importDefault(require("../types"));
const atob_1 = __importDefault(require("atob"));
const cache_data_1 = require("../utils/cache-data");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const Category_1 = __importDefault(require("../models/Category"));
const router = express_1.default.Router();
const categoryService = containerDI_1.container.get(types_1.default.ICategoryService);
const categoryController = new category_controller_1.default(categoryService);
router.get("/", async (req, res) => {
    if (req.query.name != undefined) {
        const category = await Category_1.default.findOne({
            name: atob_1.default(req.query.name),
        });
        return res.status(200).json({ success: true, payload: category });
    }
    const response = await categoryController.getCategories();
    cache_data_1.cacheData(req.originalUrl, response);
    return handleResponse_1.handleResponse(res, response);
});
router.get("/:id", async (req, res) => {
    const response = await categoryController.getCategory(req.params.id);
    return handleResponse_1.handleResponse(res, response);
});
router.post("/", 
// validatorMiddleware(identifierSchema, categorySchema),
async (req, res) => {
    const response = await categoryController.createCategory(req.body);
    cache_data_1.refreshCache(req.originalUrl);
    return handleResponse_1.handleResponse(res, response);
});
router.put("/:id", schemaValidator_1.default(validators_1.identifierSchema, validators_1.categorySchema), async (req, res) => {
    const response = await categoryController.updateCategory(req.params.id, req.body);
    cache_data_1.refreshCache(req.originalUrl);
    return handleResponse_1.handleResponse(res, response);
});
router.delete("/:id", async (req, res) => {
    // const items = await Category.find();
    // const response = items.map(async (item) => {
    //   try {
    //     // method 1 worked
    //     // come back here later
    //     // let deleted = await Category.deleteOne({ _id: item._id });
    //     // let deleted = await Category.remove({ _id: item._id });
    //     // method 2
    //     let deleted = await item.remove();
    //     return deleted;
    //   } catch (error) {
    //     console.log(error);
    //     console.log("unable to delete");
    //   }
    // });
    // const data = await Promise.all([...response]);
    // // Category.deleteOne({ })
    // return res.status(200).json({ message: "deleted", response: data });
    /**    ********Original**********/
    const response2 = await categoryController.deleteCategory(req.params.id);
    return handleResponse_1.handleResponse(res, response2);
    cache_data_1.flushCache();
    /***/
});
exports.default = router;
//# sourceMappingURL=category.route.js.map