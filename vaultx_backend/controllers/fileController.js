const File = require("../models/File");
const User = require("../models/User");

const { encryptFile } = require("../utils/cryptoUtils"); // keep only this
const crypto = require("crypto");   // ✅ ADD THIS

const fs = require("fs");
const path = require("path");


// UPLOAD FILE
exports.uploadFile = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverEmail } = req.body;

    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) return res.status(404).json({ msg: "Receiver not found" });

    // 1. Get file buffer
    const fileBuffer = req.file.buffer;

    // 2. AES Encrypt file
    const { encrypted, key, iv, tag } = encryptFile(fileBuffer);

    // 3. ✅ Encrypt AES key using receiver PUBLIC key (FIXED)
    const encryptedKey = crypto.publicEncrypt(
      {
        key: receiver.publicKey,   // ✅ correct PEM key
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      },
      key   // AES key
    ).toString("base64");   // ✅ VERY IMPORTANT

    // 4. Save encrypted file to disk
    const filename = Date.now() + "-" + req.file.originalname;
    const filePath = path.join("uploads", filename);

    fs.writeFileSync(filePath, encrypted);

    // 5. Store metadata in DB
    const fileDoc = new File({
      filename,
      path: filePath,
      encryptedKey,   // ✅ base64 string
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
      sender: senderId,
      receiver: receiver._id,
    });

    await fileDoc.save();

    // ✅ also return fileId (useful)
    res.json({
      msg: "File uploaded & encrypted successfully",
      fileId: fileDoc._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find files where user is sender OR receiver
    const files = await File.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate("receiver", "email")
      .populate("sender", "email")
      .sort({ createdAt: -1 });

    const fileData = files.map(f => ({
      id: f._id,
      filename: f.filename,
      token: f._id,
      senderId: f.sender?._id || null,
      senderEmail: f.sender?.email || "Unknown",
      receiverEmail: f.receiver?.email || "Unknown"
    }));

    res.json(fileData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
