const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invitationSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  recipientId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Invitation", invitationSchema);
