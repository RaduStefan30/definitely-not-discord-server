const User = require("../models/User");
const Invitation = require("../models/Invitation");
const serverStore = require("../serverStore");

const updateInvitations = async (id) => {
  try {
    const activeUsers = serverStore.getActiveConnections(id);
    //if there are no active connections, there is no need to run this
    if (activeUsers.length > 0) {
      const invitations = await Invitation.find({
        recipientId: id,
      }).populate("senderId", "_id email username");

      const io = serverStore.getSocketInstance();

      activeUsers.forEach((socketId) => {
        io.to(socketId).emit("invitations", {
          invitations: invitations || [],
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateFriends = async (id) => {
  try {
    const activeUsers = serverStore.getActiveConnections(id);

    //if there are no active connections, there is no need to run this
    if (activeUsers.length > 0) {
      const user = await User.findById(id, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id email username"
      );

      if (user) {
        const friendsList = user.friends.map((friend) => {
          return {
            id: friend._id,
            email: friend.email,
            username: friend.username,
          };
        });

        const io = serverStore.getSocketInstance();

        activeUsers.forEach((socketId) =>
          io.to(socketId).emit("update", { friends: friendsList || [] })
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { updateInvitations, updateFriends };
