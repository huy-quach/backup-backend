const express = require("express");
const router = express.Router();
const zalopayController = require("../controllers/zalopayController");
const { authenticateToken } = require("../middleware/authMiddleware");
// Route để tạo thanh toán qua ZaloPay
router.post("/create-payment", authenticateToken, zalopayController.createPayment);
// Route để nhận callback (webhook) từ ZaloPay khi thanh toán hoàn tất
router.post("/callback", zalopayController.handleCallback);

module.exports = router;
