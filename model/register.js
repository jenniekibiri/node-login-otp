const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
 
 phone: {
    type: Number,
    required: true,
  },
    bio: {
    type: String,
    required: true,
  },
   location: {
    type: String,
    required: true,
  },

  created: {
    type: Date,
    default: Date.now(),
  },
  updated: Date,
});
module.exports = mongoose.model("Register", registerSchema);
