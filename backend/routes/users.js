const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post"); 
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      return res.json([]);
    }

    const users = await User.find({
      name: { $regex: name, $options: "i" },
    }).select("name email profilePic");

    res.json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Error searching users" });
  }
});

router.get("/:id/public", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name profilePic bio location website education projects"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ userId: req.params.id })
      .populate("comments")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((p) => ({
      ...p._doc,
      userName: user.name,
      userProfilePic: user.profilePic,
    }));

    res.json({
      user,
      posts: formattedPosts,
    });
  } catch (err) {
    console.error("Public Profile Fetch Error:", err);
    res.status(500).json({ message: "Error fetching public profile" });
  }
});

module.exports = router;
