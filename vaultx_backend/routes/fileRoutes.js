const express = require("express");
const router = express.Router();

const { uploadFile, getFiles } = require("../controllers/fileController");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", auth, upload.single("file"), uploadFile);

router.get("/my-files", auth, getFiles);

module.exports = router;
