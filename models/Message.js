const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  date: Date,
  type: String,
});

module.exports = mongoose.model("Message", messageSchema);
