const forge = require("node-forge");

function generateKeys() {
  const keypair = forge.pki.rsa.generateKeyPair(2048);

  return {
    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
  };
}

module.exports = generateKeys;
