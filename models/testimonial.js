// models/Testimonial.js
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Đường dẫn tới file ảnh
      required: false, // Ảnh có thể không bắt buộc
    },
    rating: { type: Number, required: true }, // Thêm thuộc tính rating
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
