import { io } from "socket.io-client";

const socket = io("https://socket-fgvx.onrender.com", { autoConnect: false });

export default socket;
