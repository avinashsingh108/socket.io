import React, { useState, useEffect } from "react";
import socket from "./socket";
import Notification from "./Notification";

const Chat = () => {
  const roomId = "room1";
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setNotificationMessage(data.notification);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const handleStartChat = () => {
    const generatedName = "User" + Math.floor(Math.random() * 100);
    setUsername(generatedName);
    socket.connect();
    socket.emit("startChat", roomId);
    setConnected(true);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      message: inputMessage,
      sender: username,
      timestamp: new Date().toISOString(),
    });

    setMessages((prev) => [
      ...prev,
      {
        message: inputMessage,
        sender: username,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInputMessage("");
  };

  const handleClose = () => {
    socket.emit("leaveRoom", roomId);
    setConnected(false);
    setMessages([]);
    setUsername("");
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-4 h-[60vh] mt-28 max-md:mx-2 bg-white flex flex-col ${
        connected ? "items-start" : "items-center"
      } justify-center border border-neutral-300 rounded-md`}
    >
      {!connected ? (
        <button
          onClick={handleStartChat}
          className="mt-4 px-4 py-2 bg-neutral-800 cursor-pointer text-white text-xs rounded-md"
        >
          Start Chat
        </button>
      ) : (
        <div className="flex flex-col justify-start w-full h-full">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md bg-neutral-800 w-fit mx-auto text-white text-xs cursor-pointer"
          >
            Leave Chat
          </button>
          <div className="mt-4 p-2 text-sm font-medium min-h-[200px] overflow-auto text-neutral-500 border-t border-neutral-300">
            {messages.map((msg, idx) => (
              <div key={idx} className="py-1">
                <span className="text-neutral-700">{msg.sender}:</span>{" "}
                {msg.message}
                <span className="ml-2 text-[10px] text-gray-500 ">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex pt-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="border border-neutral-300 rounded-md px-4 py-1 text-sm focus:border-neutral-400 outline-none flex-1"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim().length === 0}
              className="ml-2 px-4 py-2 rounded-md disabled:bg-neutral-600 disabled:pointer-events-none bg-neutral-800 text-white text-xs cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {connected && notificationMessage && (
        <Notification
          message={notificationMessage}
          onClose={() => setNotificationMessage("")}
        />
      )}
    </div>
  );
};

export default Chat;
