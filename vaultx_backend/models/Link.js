const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },

  tokenHash: String,

  expiresAt: Date,
  maxViews: Number,
  views: { type: Number, default: 0 },

  password: String, // hashed (optional)

}, { timestamps: true });

module.exports = mongoose.model("Link", linkSchema);