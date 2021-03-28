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
const inversify_1 = require("inversify");
const Notification_1 = __importDefault(require("../models/Notification"));
const exceptions_1 = require("../exceptions");
let FieldService = class FieldService {
    async getFields() {
        try {
            return await Notification_1.default.find({});
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getField(id) {
        try {
            return await Notification_1.default.find({ _id: id });
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async createField(entity) {
        try {
            const field = new Notification_1.default(entity);
            return await field.save();
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async updateField(id, entity) {
        try {
            return await Notification_1.default.findByIdAndUpdate(id, entity, { new: true });
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async deleteField(id) {
        try {
            return await Notification_1.default.findByIdAndDelete(id);
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
};
FieldService = __decorate([
    inversify_1.injectable()
], FieldService);
exports.default = FieldService;
//# sourceMappingURL=field.service.js.map