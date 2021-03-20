import { Server, Socket } from "socket.io"
import SocketEvents from "../enums/SocketEvents"
import { Chat, OnlineStatus, SocketError } from "../interfaces/SocketInterfaces"
import helper from "../config/jwtHelper"
import TokenContent from "../interfaces/TokenContent"
import { container } from "../containerDI"
import { UserService, MessageService } from "../services"
import Types from "../types"
const userService = container.get<UserService>(Types.IUserService);
const messageService = container.get<MessageService>(Types.IMessageService);
// helper to disconnect user
const errorHappened = (socket:Socket, error:SocketError) => { 
  socket.emit(SocketEvents.Disconnected, error)
}


// helper to verify user
const verifyUser =  (socket, token ):any => { 
  let user: any = { };
    helper.verify(token, async (err, decoded) => {
        if (err) { 
          console.log(err)
          errorHappened(socket,{ statusCode: 401, message: "User is unauthorized" })
          socket.disconnect(true)
        } 

        const userDetails = decoded as TokenContent;
         user = await userService.getUser(userDetails._id) 
      })
      return user;
}

const runConnection = (io: Server) => { 
  io.on("connection", (socket: Socket) => { 
    //Online
    socket.on(SocketEvents.Online,async (response: OnlineStatus) => { 
    const user = await verifyUser(socket, response.token)
        io.sockets.emit(SocketEvents.UserJoined, user)
      });  
            
      socket.on(SocketEvents.SendMessage, async (response: Chat) => { 
            const user = await verifyUser(socket, response.token)
      response.user = user;
      const saved  = await messageService.saveMessage(response)
         if(saved) { 
           io.sockets.emit(SocketEvents.ReceiveMessage, response)
         }else { 
           errorHappened(socket,{ statusCode: 500, message: "Unable to save message" })
          }
      })
    })
  }


export default runConnection
