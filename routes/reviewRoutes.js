const express = require("express");
const {
  createReview,
  getReviewsByProduct,
  getReviewedProductsByUser,
} = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();
const { upload } = require("../controllers/reviewController"); // Import multer config

// Route để tạo review với hình ảnh
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  createReview
);

// Route để lấy tất cả các review theo productId
router.get("/product/:productId", getReviewsByProduct);


router.get(
  "/user-reviewed-products",
  authenticateToken,
  getReviewedProductsByUser
);
module.exports = router;
