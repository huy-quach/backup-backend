const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Testimonials Routes - Admin Only

// Thêm testimonial mới (chỉ admin)
router.post(
  "/",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  upload.single("image"), // Xử lý upload ảnh
  testimonialController.createTestimonial // Controller để tạo testimonial
);

// Cập nhật testimonial (chỉ admin)
router.put(
  "/:id",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  upload.single("image"), // Xử lý upload ảnh nếu có
  testimonialController.updateTestimonial // Controller để cập nhật testimonial
);

// Xóa testimonial (chỉ admin)
router.delete(
  "/:id",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  testimonialController.deleteTestimonial // Controller để xóa testimonial
);

// Public Routes - Available to all users
// Lấy tất cả testimonials (dành cho tất cả người dùng)
router.get("/", testimonialController.getTestimonials);

module.exports = router;
