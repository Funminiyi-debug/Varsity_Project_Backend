const runConnection = (socket) => {
  socket.emit("Hello", "HI!!!!!!!");
};

export default runConnection;
