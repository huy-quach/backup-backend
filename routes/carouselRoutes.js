const express = require("express");
const router = express.Router();
const carouselController = require("../controllers/carouselController");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục để lưu trữ ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Tên file
  },
});

const upload = multer({ storage: storage });

// Lấy tất cả carousel
router.get("/", carouselController.getAllCarousels);

// Lấy một carousel cụ thể
router.get("/:id", carouselController.getCarouselById);

// Tạo carousel mới (có upload ảnh)
router.post(
  "/",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  upload.single("image"),
  carouselController.createCarousel
);

// Cập nhật carousel (có upload ảnh mới nếu có)
router.put(
  "/:id",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  upload.single("image"),
  carouselController.updateCarousel
);

// Xóa carousel
router.delete(
  "/:id",
  authMiddleware.authenticateToken, // Xác thực người dùng
  authMiddleware.authorizeRoles("admin"), // Kiểm tra quyền admin
  carouselController.deleteCarousel
);

module.exports = router;
