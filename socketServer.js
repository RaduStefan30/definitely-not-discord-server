const authSocket = require("./middleware/authSocket");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const messageHandler = require("./socketHandlers/messageHandler");
const serverStore = require("./serverStore");
const chatHistoryHandler = require("./socketHandlers/chatHistoryHandler");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("onlineUsers", { onlineUsers });
  };

  serverStore.setSocketInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  io.on("connection", (socket) => {
    newConnectionHandler(socket);
    emitOnlineUsers();

    socket.on("message", (data) => {
      messageHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });

    socket.on("chatHistory", (data) => {
      chatHistoryHandler(socket, data);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 5000);
};

module.exports = {
  registerSocketServer,
};
