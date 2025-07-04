const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  password: String,
  lastSeen: { type: Date, default: Date.now },
  online: { type: Boolean, default: false },
  avatar: String // dummy image URL
});

module.exports = mongoose.model("User", UserSchema);
