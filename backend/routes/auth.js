const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//  Signup
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, securityQuestion, securityAnswer } = req.body;

    email = email.trim().toLowerCase();

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    if (!securityQuestion || !securityAnswer)
      return res
        .status(400)
        .json({ message: "Security question and answer are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

//  Login
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase(); 

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/find-question", async (req, res) => {
  try {
    let { email } = req.body;
    email = email.trim().toLowerCase(); 

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ question: user.securityQuestion });
  } catch (err) {
    console.error("Find question error:", err);
    res.status(500).json({ message: "Error fetching question" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    let { email, answer, newPassword } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });


    const isAnswerValid = await bcrypt.compare(
      answer.toLowerCase().trim(),
      user.securityAnswer
    );
    if (!isAnswerValid)
      return res.status(400).json({ message: "Incorrect security answer" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
});
//  Token Verification Route
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ valid: false });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ valid: false });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ valid: true, user: decoded });
    } catch (err) {
      return res.status(401).json({ valid: false });
    }
  } catch (err) {
    console.error("Token verify error:", err);
    res.status(500).json({ valid: false });
  }
});


module.exports = router;
