const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
console.log(" post.js routes loaded successfully");

router.get("/test", (req, res) => {
  res.json({ message: "✅ post.js is working fine" });
});


router.post("/", verifyToken, async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content?.trim() && !image)
      return res.status(400).json({ message: "Post cannot be empty" });

    const hashtags = content.match(/#\w+/g) || [];
    const cleanedHashtags = hashtags.map((tag) => tag.toLowerCase());

    const post = new Post({
      userId: req.user.id,
      userName: req.user.name,
      userProfilePic: req.user.profilePic || null,
      content: content.trim(),
      image: image || null,
      hashtags: cleanedHashtags,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Error creating post" });
  }
});

router.get("/my-posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("comments")
      .lean();

    const userPosts = posts.map((post) => ({
      ...post,
      userName: req.user.name,
      userProfilePic: req.user.profilePic || post.userProfilePic || null,
    }));

    res.json(userPosts);
  } catch (err) {
    console.error("My Posts Error:", err);
    res.status(500).json({ message: "Error fetching user's posts" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("comments")
      .populate("userId", "profilePic name email")
      .sort({ createdAt: -1 });

    const postsWithUser = posts.map((post) => ({
      ...post._doc,
      userProfilePic: post.userId?.profilePic || post.userProfilePic || null,
      userName: post.userId?.name || post.userName,
      userEmail: post.userId?.email || "",
    }));

    res.json(postsWithUser);
  } catch (err) {
    console.error("Fetch Posts Error:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
router.get("/search/:keyword", async (req, res) => {
  try {
    const keyword = String(req.params.keyword || "").trim();
    if (!keyword) return res.json([]);

    const posts = await Post.find({
      content: { $regex: keyword, $options: "i" },
    })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    const formatted = posts.map((p) => ({
      ...p._doc,
      userName: p.userId?.name || "Unknown User",
      userProfilePic: p.userId?.profilePic || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Error fetching search results" });
  }
});


router.get("/trending", async (req, res) => {
  try {
    const trending = await Post.aggregate([
      { $unwind: "$hashtags" },
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(trending);
  } catch (err) {
    console.error("Trending Hashtags Error:", err);
    res.status(500).json({ message: "Error fetching trending hashtags" });
  }
});

router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    post.likes = alreadyLiked
      ? post.likes.filter((id) => id.toString() !== userId)
      : [...post.likes, userId];

    await post.save();
    res.json({ likes: post.likes, message: "Toggled like successfully" });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ message: "Error liking post" });
  }
});


router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim())
      return res.status(400).json({ message: "Comment cannot be empty" });

    const comment = new Comment({
      postId: req.params.id,
      userId: req.user.id,
      userName: req.user.name,
      text: text.trim(),
    });

    await comment.save();
    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment._id },
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (req.params.id === "my-posts")
      return res.status(400).json({ message: "Invalid Post ID" });

    const post = await Post.findById(req.params.id)
      .populate("comments")
      .populate("userId", "name profilePic email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({
      ...post._doc,
      userName: post.userId?.name,
      userProfilePic: post.userId?.profilePic || "",
      userEmail: post.userId?.email || "",
    });
  } catch (err) {
    console.error("Get Single Post Error:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    post.content = content?.trim() || post.content;

    const hashtags = post.content.match(/#\w+/g) || [];
    post.hashtags = hashtags.map((tag) => tag.toLowerCase());

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (err) {
    console.error("Edit Post Error:", err);
    res.status(500).json({ message: "Error editing post" });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
});

module.exports = router;
