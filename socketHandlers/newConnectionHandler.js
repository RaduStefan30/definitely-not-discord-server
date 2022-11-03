const serverStore = require("../serverStore");
const friendsHandler = require("../socketHandlers/friendsHandler");

const newConnectionHandler = async (socket) => {
  const userData = socket.user;
  //might need error handling
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userData.id,
  });

  friendsHandler.updateInvitations(userData.id);
  friendsHandler.updateFriends(userData.id);
};

module.exports = newConnectionHandler;
