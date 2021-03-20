import { Socket } from 'socket.io'
// import SocketEvents from "../enums/SocketEvents"

const runConnection = (io) => {
  io.on('connection', (socket: Socket) => {
    console.log('a socket connected')
  })
}

export default runConnection
