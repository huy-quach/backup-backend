const express = require("express");
const {
  importProducts,
  getInventory,
  getProductInventory,
} = require("../controllers/inventoryController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

// Cấu hình multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Đặt thư mục lưu file ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Tên file duy nhất dựa trên thời gian
  },
});


const upload = multer({ storage: storage });

// Route để nhập hàng vào kho (Chỉ admin mới được phép)
router.post(
  "/import",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"), // Xử lý upload một file ảnh với field "image"
  importProducts
);

// Route để xem toàn bộ kho hàng (Admin hoặc các vai trò có quyền truy cập)
router.get("/", getInventory);

// Route để xem tồn kho của một sản phẩm cụ thể (Có thể yêu cầu xác thực, tùy theo yêu cầu)
router.get(
  "/:productId",
  authenticateToken,
  authorizeRoles("admin"),
  getProductInventory
);

module.exports = router;
