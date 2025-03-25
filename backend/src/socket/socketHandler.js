module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on("startChat", (roomId) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", ({ roomId, message, sender }) => {
      if (!roomId || !message || !sender) return;

      socket.to(roomId).emit("receiveMessage", {
        message,
        sender,
        notification: `New message from ${sender}`,
      });
    });
    socket.on("leaveRoom", (roomId) => {
      if (!roomId) return;

      socket.leave(roomId);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
