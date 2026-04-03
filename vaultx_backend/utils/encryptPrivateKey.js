const crypto = require("crypto");

function encryptPrivateKey(privateKey) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PRIVATE_KEY_SECRET, "utf-8").slice(0, 32),
    Buffer.alloc(16, 0)
  );

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

function decryptPrivateKey(encryptedKey) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PRIVATE_KEY_SECRET, "utf-8").slice(0, 32),
    Buffer.alloc(16, 0)
  );

  let decrypted = decipher.update(encryptedKey, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encryptPrivateKey, decryptPrivateKey };