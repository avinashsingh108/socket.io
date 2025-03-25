const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const socketHandler = require("./src/socket/socketHandler");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://socket-kappa-self.vercel.app",
  },
});

socketHandler(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log("server running");
});
