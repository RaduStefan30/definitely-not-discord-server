const Conversation = require("../models/Conversation");
const serverStore = require("../serverStore");

const updateChat = async (conversationId, socketId = null) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: { path: "senderId", model: "User", select: "_id username" },
  });

  if (conversation) {
    const io = serverStore.getSocketInstance();

    //initial update
    if (socketId) {
      return io.to(socketId).emit("chatHistory", {
        messages: conversation.messages,
        interlocutors: conversation.interlocutors,
      });
    }

    //update for the interlocutors, if they are online
    conversation.interlocutors.forEach((id) => {
      const activeConnections = serverStore.getActiveConnections(id.toString());

      return activeConnections.forEach((socketId) => {
        io.to(socketId).emit("chatHistory", {
          messages: conversation.messages,
          interlocutors: conversation.interlocutors,
        });
      });
    });
  }
};

module.exports = { updateChat };
