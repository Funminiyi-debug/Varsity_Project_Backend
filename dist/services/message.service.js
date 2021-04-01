"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Room_1 = __importDefault(require("../models/Room"));
const types_1 = __importDefault(require("../types"));
const _1 = require(".");
let MessageService = class MessageService {
    /**
     *
     */
    constructor(userService) {
        this.userService = userService;
        this.saveMessage = async (response) => {
            try {
                if (response.user == undefined) {
                    return false;
                }
                const message = { message: response.message, sender: response.user._id };
                await Room_1.default.findByIdAndUpdate(response.room, {
                    $push: { chats: message },
                });
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        };
        this.createRoom = async (sender, receiver, roomName, message) => {
            try {
                const receiverExists = await this.userService.getUser(receiver);
                if (receiverExists != null) {
                    const status = await Room_1.default.create({
                        roomName,
                        chats: [{ message, sender }],
                        participants: [sender, receiver],
                    });
                    return await (await status.save()).populate("participants");
                }
                return null;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        };
    }
};
MessageService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.IUserService)),
    __metadata("design:paramtypes", [_1.UserService])
], MessageService);
exports.default = MessageService;
//# sourceMappingURL=message.service.js.map