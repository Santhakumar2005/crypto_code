const express = require("express");
const router = express.Router();

const { generateLink } = require("../controllers/linkController");
const auth = require("../middleware/authMiddleware");
const { accessFile } = require("../controllers/linkController");

router.post("/share/:token", accessFile);

router.post("/generate-link", auth, generateLink);

module.exports = router;