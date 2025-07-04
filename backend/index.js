const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// --- Socket.IO Logic ---
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // Join room by user ID
  socket.on("user-connected", (userId) => {
    socket.join(userId);
    console.log(`📡 User ${userId} joined room`);
  });

  // When a message is sent
  socket.on("send-message", (data) => {
    // Emit only to receiver's room
    io.to(data.receiverId).emit("receive-message", data);
    console.log("📨 Message sent from", data.senderId, "to", data.receiverId);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
