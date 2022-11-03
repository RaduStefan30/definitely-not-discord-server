const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const chatHandler = require("./chatHandler");

const messageHandler = async (socket, data) => {
  try {
    const { id } = socket.user;

    const { recipientId, content } = data;

    const message = await Message.create({
      content,
      senderId: id,
      date: new Date(),
      type: "direct",
    });

    const conversation = await Conversation.findOne({
      interlocutors: { $all: [id, recipientId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();
      chatHandler.updateChat(conversation._id.toString());
    } else {
      //create logic in case of no content
      const newConversation = await Conversation.create({
        messages: [message._id],
        interlocutors: [id, recipientId],
      });

      chatHandler.updateChat(newConversation._id.toString());
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = messageHandler;
