const Conversation = require("../models/Conversation");
const chatHandler = require("./chatHandler");

const chatHistoryHandler = async (socket, data) => {
  try {
    const { id } = socket.user;

    const { recipientId } = data;

    const conversation = await Conversation.findOne({
      interlocutors: { $all: [id, recipientId] },
    });

    if (conversation) {
      chatHandler.updateChat(conversation._id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = chatHistoryHandler;
