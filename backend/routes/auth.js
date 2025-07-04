const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ msg: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const dummyAvatars = [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3"
    ];
    const avatar = dummyAvatars[Math.floor(Math.random() * dummyAvatars.length)];

    const user = new User({ name, phone, password: hashed, avatar });
    await user.save();

    res.status(200).json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all users (for Add User)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "_id name phone avatar");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error getting users" });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
