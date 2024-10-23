const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Route lưu giỏ hàng
router.post("/", authenticateToken, cartController.saveCart);

// Route lấy giỏ hàng
router.get("/", authenticateToken, cartController.getCart);

router.delete("/", authenticateToken, cartController.clearCart);
module.exports = router;
