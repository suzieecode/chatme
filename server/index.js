// ===== Imports =====
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");
const Message = require("./models/Message");

// ===== MongoDB Connection =====
mongoose.connect(
    process.env.MONGODB_URI
)
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("MongoDB connection error:", err));

// ===== Express Setup =====
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);

// ===== Socket Setup =====
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// This object will map: email -> socketId
let onlineUsers = {};

// ===== Socket Logic =====
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register which user is on which socket
  socket.on("register_user", (email) => {
    onlineUsers[email] = socket.id;
    console.log("Online users:", onlineUsers);
  });

  // When message is sent from frontend
  socket.on("send_message", async (data) => {
    try {
      const receiverSocketId = onlineUsers[data.receiverEmail];

      // Save message in MongoDB
      const newMessage = new Message({
        senderEmail: data.senderEmail,
        receiverEmail: data.receiverEmail,
        text: data.text,
      });

      await newMessage.save();

      // Send to receiver
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
      }

      // Send back to sender
      socket.emit("receive_message", data);

    } catch (err) {
      console.error("Message error:", err);
    }
  });

  // Remove user from map when they disconnect
  socket.on("disconnect", () => {
    for (let email in onlineUsers) {
      if (onlineUsers[email] === socket.id) {
        delete onlineUsers[email];
      }
    }
  });
});

// ===== API Routes =====

// Save user to DB
app.post("/save-user", async (req, res) => {
  try {
    const { name, email, photo, uid } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, photo, uid });
      await user.save();
      console.log("New user saved");
    } else {
      console.log("User already exists");
    }

    res.send("User processed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving user");
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// Get chat history between two users
app.get("/messages", async (req, res) => {
    try {
      const { senderEmail, receiverEmail } = req.query;
  
      // Find messages where:
      // A -> B OR B -> A
      const messages = await Message.find({
        $or: [
          { senderEmail, receiverEmail },
          { senderEmail: receiverEmail, receiverEmail: senderEmail },
        ],
      }).sort({ timestamp: 1 }); // oldest first
  
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching messages");
    }
  });

// ===== Start Server =====
server.listen(process.env.PORT || 5005, () => {
  console.log("Server running on port 5005");
});