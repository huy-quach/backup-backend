const express = require("express");
const {
  getAllFurniture,
  updateFurniture,
  hideFurniture,
  getHiddenFurniture,
  getFurnitureById,
  unhideFurniture,
  upload,
} = require("../controllers/furnitureController");
const furnitureController = require("../controllers/furnitureController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/count", furnitureController.countFurniture);

// Lấy tất cả các sản phẩm
router.get("/", getAllFurniture);

router.get("/search", furnitureController.searchFurniture);
// Tạo sản phẩm mới (Chỉ admin mới được phép)

// Cập nhật sản phẩm (Chỉ admin mới được phép)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("image"),
  updateFurniture
);

// Xóa sản phẩm (Chỉ admin mới được phép)
router.put(
  "/:productId/hide",
  authenticateToken,
  authorizeRoles("admin"),
  hideFurniture
);

// Route để lấy các sản phẩm bị ẩn
router.get("/hidden", authenticateToken, authorizeRoles("admin"), getHiddenFurniture);

// Route để bỏ ẩn sản phẩm
router.put(
  "/:productId/unhide",
  authenticateToken,
  authorizeRoles("admin"),
  unhideFurniture
);

// Lấy sản phẩm theo ID (Không yêu cầu xác thực, hoặc bạn có thể thêm middleware nếu cần)
router.get("/:id", getFurnitureById);

module.exports = router;
