"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketEvents_1 = __importDefault(require("../enums/SocketEvents"));
const jwtHelper_1 = __importDefault(require("../config/jwtHelper"));
const containerDI_1 = require("../containerDI");
const types_1 = __importDefault(require("../types"));
const userService = containerDI_1.container.get(types_1.default.IUserService);
const messageService = containerDI_1.container.get(types_1.default.IMessageService);
// helper to disconnect user
const errorHappened = (socket, error) => {
    socket.emit(SocketEvents_1.default.Disconnected, error);
};
// helper to verify user
const verifyUser = (socket, token) => {
    let user = {};
    jwtHelper_1.default.verify(token, async (err, decoded) => {
        if (err) {
            console.log(err);
            errorHappened(socket, {
                statusCode: 401,
                message: "User is unauthorized",
            });
            socket.disconnect(true);
        }
        const userDetails = decoded;
        user = await userService.getUser(userDetails._id);
    });
    return user;
};
const runConnection = (io) => {
    io.on("connection", (socket) => {
        //Online
        socket.on(SocketEvents_1.default.Online, async (response) => {
            const user = await verifyUser(socket, response.token);
            io.sockets.emit(SocketEvents_1.default.UserJoined, user);
        });
        // Send message event
        socket.on(SocketEvents_1.default.SendMessage, async (response) => {
            const user = await verifyUser(socket, response.token);
            response.user = user;
            const saved = await messageService.saveMessage(response);
            if (saved) {
                io.sockets
                    .in(response.room)
                    .emit(SocketEvents_1.default.ReceiveMessage, response);
            }
            else {
                errorHappened(socket, {
                    statusCode: 500,
                    message: "Unable to save message",
                });
            }
        });
        socket.on(SocketEvents_1.default.Typing, async (response) => {
            const user = await verifyUser(socket, response.token);
            if (user) {
                io.sockets.emit(SocketEvents_1.default.NotifyTyping, user);
            }
            else {
                errorHappened(socket, {
                    message: "Unable to verify user",
                    statusCode: 401,
                });
            }
        });
        socket.on(SocketEvents_1.default.StopTyping, async (response) => {
            const user = await verifyUser(socket, response.token);
            if (user) {
                io.sockets.emit(SocketEvents_1.default.NotifyStopTyping, user);
            }
            else {
                errorHappened(socket, {
                    message: "Unable to verify user",
                    statusCode: 401,
                });
            }
        });
        socket.on(SocketEvents_1.default.StartConversation, async (response) => {
            const user = await verifyUser(socket, response.token);
            if (user) {
                const createdRoom = await messageService.createRoom(response.roomName, user._id, response.receiver, response.message);
                if (createdRoom != null) {
                    // frontend is supposoed to add the receiver to the new room and populate it with the message from the sender
                    //he can then emit the SendMessage event
                    io.sockets.emit(SocketEvents_1.default.NotifyStartConversation, createdRoom);
                }
                else {
                    errorHappened(socket, {
                        statusCode: 500,
                        message: "Unable to start conversation",
                    });
                }
            }
        });
    });
};
exports.default = runConnection;
//# sourceMappingURL=index.js.map