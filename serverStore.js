const connectedUsers = new Map();

let io;

const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};

const getSocketInstance = () => {
  return io;
};

const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
};

const removeConnectedUser = (socketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
  }
};

const getActiveConnections = (id) => {
  const activeConnections = [];

  connectedUsers.forEach((value, key) => {
    if (value.userId === id) activeConnections.push(key);
  });

  return activeConnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  return onlineUsers;
};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  setSocketInstance,
  getSocketInstance,
  getOnlineUsers,
};
