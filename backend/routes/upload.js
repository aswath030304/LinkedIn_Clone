const express = require("express");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary"); 
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "connectify_profiles",
      transformation: [
        { width: 1080, height: 1080, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
