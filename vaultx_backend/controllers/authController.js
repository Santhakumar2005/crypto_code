const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateKeys = require("../utils/generateKeys");
const { encryptPrivateKey } = require("../utils/encryptPrivateKey");


// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate RSA keys
    const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,

  publicKeyEncoding: {
    type: "spki",
    format: "pem"
  },

  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem"
  }
});


    // encrypt private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      publicKey,
      privateKey      
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        publicKey: user.publicKey, // needed for sharing
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
