const crypto = require("crypto");
const forge = require("node-forge");

// AES ENCRYPT FILE
function encryptFile(buffer) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return { encrypted, key, iv, tag };
}

// RSA ENCRYPT AES KEY
function encryptAESKey(aesKey, publicKey) {
  const pubKey = forge.pki.publicKeyFromPem(publicKey);

  const encryptedKey = pubKey.encrypt(aesKey.toString("binary"));

  return encryptedKey;
}

module.exports = { encryptFile, encryptAESKey };
