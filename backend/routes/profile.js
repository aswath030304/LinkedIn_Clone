const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.put("/update", verifyToken, async (req, res) => {
  try {
    const disallowed = [
      "password",
      "email",
      "_id",
      "__v",
      "securityAnswer",
      "securityQuestion",
    ];

    const updateData = {};
    for (const key in req.body) {
      if (!disallowed.includes(key)) updateData[key] = req.body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});


router.put("/add-education", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.education.push(req.body);
    await user.save();

    res.json({ message: "Education added successfully", user });
  } catch (err) {
    console.error("Error adding education:", err);
    res.status(500).json({ message: "Error adding education" });
  }
});

router.put("/update-education/:eduId", verifyToken, async (req, res) => {
  try {
    const { eduId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const edu = user.education.id(eduId);
    if (!edu) return res.status(404).json({ message: "Education not found" });

    Object.keys(req.body).forEach((key) => {
      edu[key] = req.body[key];
    });

    await user.save();
    res.json({ message: "Education updated successfully", user });
  } catch (err) {
    console.error("Error updating education:", err);
    res.status(500).json({ message: "Error updating education" });
  }
});

router.delete("/delete-education/:eduId", verifyToken, async (req, res) => {
  try {
    const { eduId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const edu = user.education.id(eduId);
    if (!edu) return res.status(404).json({ message: "Education not found" });

    edu.deleteOne();
    await user.save();

    res.json({ message: "Education deleted successfully", user });
  } catch (err) {
    console.error("Error deleting education:", err);
    res.status(500).json({ message: "Error deleting education" });
  }
});

router.put("/add-project", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.projects.push(req.body);
    await user.save();

    res.json({ message: "Project added successfully", user });
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ message: "Error adding project" });
  }
});

router.put("/update-project/:projId", verifyToken, async (req, res) => {
  try {
    const { projId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.id(projId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.keys(req.body).forEach((key) => {
      project[key] = req.body[key];
    });

    await user.save();
    res.json({ message: "Project updated successfully", user });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Error updating project" });
  }
});

router.delete("/delete-project/:projId", verifyToken, async (req, res) => {
  try {
    const { projId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.id(projId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.deleteOne();
    await user.save();

    res.json({ message: "Project deleted successfully", user });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Error deleting project" });
  }
});

module.exports = router;
