const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email profilePic");

    if (!user)
      return res.status(404).json({ message: "User not found" });
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || null,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = { verifyToken };
