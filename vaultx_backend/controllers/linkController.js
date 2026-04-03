const Link = require("../models/Link");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const File = require("../models/File");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");


exports.accessFile = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, password,accountPassword} = req.body; // now email is sent in POST body

    // 1. HASH TOKEN
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 2. FIND LINK
    const link = await Link.findOne({ tokenHash });
    if (!link) return res.status(404).json({ error: "Invalid link" });

    // 3. CHECK EXPIRY
    if (link.expiresAt < new Date()) return res.status(400).json({ error: "Link expired" });

    // 4. CHECK MAX VIEWS
    if (link.views >= link.maxViews) return res.status(400).json({ error: "Max views exceeded" });

    // 5. GET FILE AND RECEIVER
    const file = await File.findById(link.fileId).populate("receiver");
    if (!file) return res.status(404).json({ error: "File not found" });

    // 6. CHECK EMAIL MATCH
    if (!email || email !== file.receiver.email) {
      return res.status(401).json({ error: "You are not authorized to access this file" });
    }
    // 🔥 NEW: CHECK ACCOUNT PASSWORD FROM USERS COLLECTION
const user = await User.findOne({ email });

if (!user) {
  return res.status(401).json({ error: "User not found" });
}

if (!accountPassword) {
  return res.status(401).json({ error: "Account password required" });
}

const isAccountMatch = await bcrypt.compare(accountPassword, user.password);

if (!isAccountMatch) {
  return res.status(401).json({ error: "Invalid account password" });
}

    // 7. CHECK OPTIONAL PASSWORD
    if (link.password) {
      if (!password) return res.status(401).json({ error: "Password required" });
      console.log("Entered Email:", email);
console.log("DB Email:", file.receiver.email);

console.log("Entered Password:", password);
console.log("Hashed Password:", link.password);

      const isMatch = await bcrypt.compare(password, link.password);
      if (!isMatch) return res.status(401).json({ error: "Wrong password" });
    }

    // 8. GET RECEIVER PRIVATE KEY
    const privateKey = file.receiver.privateKey;

    const aesKey = crypto.privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      Buffer.from(file.encryptedKey, "base64")
    );

    const fileData = fs.readFileSync(file.path);

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      aesKey,
      Buffer.from(file.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(file.tag, "hex"));

    let decrypted = Buffer.concat([decipher.update(fileData), decipher.final()]);

    // 9. INCREMENT VIEW COUNT
    link.views += 1;
    await link.save();

    // 10. SEND FILE
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.send(decrypted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GENERATE LINK
exports.generateLink = async (req, res) => {
  try {
    const { fileId, expiresInMinutes, maxViews, password } = req.body;

    // 1. Generate random token
    const token = crypto.randomBytes(32).toString("hex");

    // 2. Hash token (important security step)
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 3. Handle expiry
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    // 4. Hash password (if provided)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 5. Save to DB
    const link = new Link({
      fileId,
      tokenHash,
      expiresAt,
      maxViews,
      password: hashedPassword,
    });

    await link.save();

    // 6. Return actual link (NOT hashed)
    const shareLink = `http://localhost:3000/share/${token}`;

    res.json({ link: shareLink });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};