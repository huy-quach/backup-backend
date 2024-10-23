const express = require("express");
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
} = require("../controllers/orderController");
const { updateOrderStatus } = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Tạo đơn hàng
router.post("/", authenticateToken, createOrder);

router.get("/count", orderController.countOrders);

// Lấy danh sách đơn hàng của người dùng, cần xác thực
router.get("/user", authenticateToken, getOrdersByUser);

router.get("/", authenticateToken, getAllOrders); // Admin lấy tất cả đơn hàng

router.put("/:id/status", authenticateToken, updateOrderStatus);
module.exports = router;
