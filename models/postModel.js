const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 128,
  },
  description: {
    type: String,
    required: true,
    max: 2048,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  userid: {
    type: String,
    required: true,
    max: 64,
    min: 12,
  },
});

module.exports = { postSchema: mongoose.model("posts", postSchema) };
