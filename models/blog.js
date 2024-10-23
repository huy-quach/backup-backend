// models/blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Business", "Sport", "Game", "Life"],
  }, // Chỉ cho phép các giá trị này required: true, },
  createdAt: { type: Date, default: Date.now },

  // New fields for interactions
  likes: { type: Number, default: 0 },
  usefulVotes: { type: Number, default: 0 },
  notUsefulVotes: { type: Number, default: 0 },
  likers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách những user đã like
  usefulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách user đã vote useful
  notUsefulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách user đã vote not useful
});

module.exports = mongoose.model("Blog", blogSchema);
