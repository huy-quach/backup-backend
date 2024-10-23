// controllers/testimonialController.js
const Testimonial = require("../models/testimonial");

// Lấy tất cả testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials", error });
  }
};

// Thêm mới testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const newTestimonial = new Testimonial({
      name: req.body.name,
      message: req.body.message,
      image: req.file ? req.file.filename : null,
      rating: req.body.rating, // Lấy giá trị rating từ body
    });
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Chỉnh sửa testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage; // Lấy ảnh mới hoặc ảnh đã tồn tại

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        name,
        message,
        image,
      },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to update testimonial", error });
  }
};

// Xóa testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial", error });
  }
};
