const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get messages between two users
router.get('/:senderId/:receiverId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.senderId, receiverId: req.params.receiverId },
        { senderId: req.params.receiverId, receiverId: req.params.senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Message Fetch Error:", err); // ✅ Add this
    res.status(500).json({ message: "Failed to load messages" });
  }
});

module.exports = router;
