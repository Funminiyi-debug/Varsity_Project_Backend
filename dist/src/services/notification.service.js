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
let NotificationService = class NotificationService {
    async getNotifications(userid) {
        try {
            // const allNotifications = await Notification.find();
            return await Notification_1.default.find({ user: userid });
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async getNotification(id, userid) {
        try {
            return await Notification_1.default.find({ _id: id, user: userid });
        }
        catch (error) {
            console.log(error);
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async createNotification(entity) {
        try {
            const notification = new Notification_1.default(entity);
            return await notification.save();
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async updateNotification(id, entity) {
        try {
            return await Notification_1.default.findByIdAndUpdate(id, entity, { new: true });
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
    async deleteNotification(id, userid) {
        try {
            return await Notification_1.default.findOneAndDelete({ _id: id, user: userid });
        }
        catch (error) {
            throw exceptions_1.ServerErrorException(error);
        }
    }
};
NotificationService = __decorate([
    inversify_1.injectable()
], NotificationService);
exports.default = NotificationService;
//# sourceMappingURL=notification.service.js.map