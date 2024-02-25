// server.js
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*"
    }
});

connectDB();
// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blog", blogRoutes);

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comment", commentRoutes);

const likeRoutes = require("./routes/likeRoutes");
app.use("/api/blog/like", likeRoutes);

const jobRoutes = require("./routes/jobRoutes");
app.use("/api/job", jobRoutes);

const compileRoutes = require("./routes/compileRoutes");
app.use("/api/compile", compileRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io
io.on("connection", (socket) => {
    // Join a room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`A user joined room: ${room}`);
    });
  
    // Handle code changes within a room
    socket.on("codeChange", (data, room) => {
      // Emit changes only to users in the same room
      console.log(data)
      socket.to(room).emit("codeUpdate", data);
    });
  
    // Optional: Handle leaving the room if needed
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`A user left room: ${room}`);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
});

// Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
