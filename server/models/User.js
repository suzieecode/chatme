// models/User.js

// Import mongoose
const mongoose = require("mongoose");

// Create a schema (structure) for User
const userSchema = new mongoose.Schema({
  name: String,      // User's full name from Google
  email: String,     // User's email (unique)
  photo: String,     // Profile photo URL
  uid: String,       // Unique ID from Firebase
});

// Create a model from schema
const User = mongoose.model("User", userSchema);

// Export it to use in other files
module.exports = User;