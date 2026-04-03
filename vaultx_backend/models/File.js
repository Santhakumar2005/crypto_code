const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,

  encryptedKey: String, // RSA encrypted AES key
  iv: String,
  tag: String,

  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
