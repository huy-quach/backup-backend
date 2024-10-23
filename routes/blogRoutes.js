const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });
router.get("/count", blogController.countBlogs);
// Blog Routes - Admin Only
router.post(
  "/",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  upload.single("image"), // Xử lý upload ảnh
  blogController.createBlog // Controller để tạo blog
);

router.put(
  "/:id",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  upload.single("image"), // Xử lý upload ảnh nếu có
  blogController.updateBlog // Controller để cập nhật blog
);
router.delete(
  "/:id",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  blogController.deleteBlog // Controller để xóa blog
);

// Public Routes - Available to all users
router.get("/", blogController.getAllBlogs); // Lấy tất cả blogs
router.get("/:id", blogController.getBlogById); // Lấy blog cụ thể theo ID

// Interaction routes - accessible by any authenticated user
router.post(
  "/:id/like",
  authMiddleware.authenticateToken, // Xác thực người dùng trước khi like
  blogController.likeBlog // Controller để like blog
);

router.post(
  "/:id/vote-useful",
  authMiddleware.authenticateToken, // Xác thực người dùng trước khi vote hữu ích
  blogController.voteUseful // Controller để vote hữu ích
);

router.post(
  "/:id/vote-not-useful",
  authMiddleware.authenticateToken, // Xác thực người dùng trước khi vote không hữu ích
  blogController.voteNotUseful // Controller để vote không hữu ích
);



module.exports = router;
