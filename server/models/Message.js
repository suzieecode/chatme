// models/Message.js

const mongoose = require("mongoose");

// Structure of each chat message
const messageSchema = new mongoose.Schema({
  senderEmail: String,
  receiverEmail: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);