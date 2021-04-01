"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inversify_1 = require("inversify");
const exceptions_1 = require("../exceptions");
const AppFile_1 = __importDefault(require("../models/AppFile"));
let AppFileService = class AppFileService {
    async deleteAppFile(id) {
        return await AppFile_1.default.findByIdAndDelete(id);
    }
    async getAppFile(id) {
        try {
            return await AppFile_1.default.findById(id)
                .populate("postid")
                .populate("productId")
                .populate("serviceId");
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async getAllAppFiles() {
        try {
            return await AppFile_1.default.find()
                .populate("postid")
                .populate("productId")
                .populate("serviceId");
        }
        catch (error) {
            throw new exceptions_1.ServerErrorException(error);
        }
    }
    async addAppFile(entity) {
        try {
            const image = {
                name: `image_${entity.originalname}`,
                data: fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../", entity.path)),
                mimetype: entity.mimetype,
            };
            return await AppFile_1.default.create(image);
        }
        catch (error) {
            console.log(error);
            throw new exceptions_1.ServerErrorException(error);
        }
    }
};
AppFileService = __decorate([
    inversify_1.injectable()
], AppFileService);
exports.default = AppFileService;
//# sourceMappingURL=appfile.service.js.map