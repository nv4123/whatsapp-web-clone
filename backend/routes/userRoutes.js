router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to get users" });
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("User List Error:", err); // ✅ Add this
    res.status(500).json({ message: "Failed to get users" });
  }
});
