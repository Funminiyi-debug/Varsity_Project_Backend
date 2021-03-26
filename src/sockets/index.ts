import { Server, Socket } from "socket.io";
import SocketEvents from "../enums/SocketEvents";
import {
  Chat,
  OnlineStatus,
  SocketError,
  StartOfConversation,
} from "../interfaces/SocketInterfaces";
import helper from "../config/jwtHelper";
import TokenContent from "../interfaces/TokenContent";
import { container } from "../containerDI";
import { UserService, MessageService } from "../services";
import Types from "../types";
const userService = container.get<UserService>(Types.IUserService);
const messageService = container.get<MessageService>(Types.IMessageService);
// helper to disconnect user
const errorHappened = (socket: Socket, error: SocketError) => {
  socket.emit(SocketEvents.Disconnected, error);
};

// helper to verify user
const verifyUser = (socket, token): any => {
  let user: any = {};
  helper.verify(token, async (err, decoded) => {
    if (err) {
      console.log(err);
      errorHappened(socket, {
        statusCode: 401,
        message: "User is unauthorized",
      });
      socket.disconnect(true);
    }

    const userDetails = decoded as TokenContent;
    user = await userService.getUser(userDetails._id);
  });
  return user;
};

const runConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    //Online
    socket.on(SocketEvents.Online, async (response: OnlineStatus) => {
      const user = await verifyUser(socket, response.token);
      io.sockets.emit(SocketEvents.UserJoined, user);
    });

    // Send message event
    socket.on(SocketEvents.SendMessage, async (response: Chat) => {
      const user = await verifyUser(socket, response.token);
      response.user = user;
      const saved = await messageService.saveMessage(response);
      if (saved) {
        io.sockets
          .in(response.room)
          .emit(SocketEvents.ReceiveMessage, response);
      } else {
        errorHappened(socket, {
          statusCode: 500,
          message: "Unable to save message",
        });
      }
    });

    socket.on(SocketEvents.Typing, async (response: OnlineStatus) => {
      const user = await verifyUser(socket, response.token);

      if (user) {
        io.sockets.emit(SocketEvents.NotifyTyping, user);
      } else {
        errorHappened(socket, {
          message: "Unable to verify user",
          statusCode: 401,
        } as SocketError);
      }
    });

    socket.on(SocketEvents.StopTyping, async (response: OnlineStatus) => {
      const user = await verifyUser(socket, response.token);

      if (user) {
        io.sockets.emit(SocketEvents.NotifyStopTyping, user);
      } else {
        errorHappened(socket, {
          message: "Unable to verify user",
          statusCode: 401,
        } as SocketError);
      }
    });

    socket.on(
      SocketEvents.StartConversation,
      async (response: StartOfConversation) => {
        const user = await verifyUser(socket, response.token);

        if (user) {
          const createdRoom = await messageService.createRoom(
            response.roomName,
            user._id,
            response.receiver,
            response.message
          );

          if (createdRoom != null) {
            // frontend is supposoed to add the receiver to the new room and populate it with the message from the sender
            //he can then emit the SendMessage event
            io.sockets.emit(SocketEvents.NotifyStartConversation, createdRoom);
          } else {
            errorHappened(socket, {
              statusCode: 500,
              message: "Unable to start conversation",
            } as SocketError);
          }
        }
      }
    );
  });
};

export default runConnection;
