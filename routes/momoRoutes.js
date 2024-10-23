const express = require("express");
const { createMoMoPayment } = require("../controllers/momoController");
const router = express.Router();

// Định tuyến tạo thanh toán qua MoMo
router.post("/create-payment", createMoMoPayment);

module.exports = router;
