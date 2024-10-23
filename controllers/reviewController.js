const Review = require("../models/review");
const multer = require("multer");
const path = require("path");

// Cấu hình multer để lưu trữ ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
  },
});

const upload = multer({ storage: storage });

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id; // Lấy từ middleware xác thực

    // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    const reviewData = {
      productId,
      userId,
      rating,
      comment,
    };

    // Nếu có file hình ảnh, thêm vào dữ liệu
    if (req.file) {
      reviewData.image = req.file.filename;
    }

    const review = new Review(reviewData);
    await review.save();

    return res
      .status(201)
      .json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Server error" });
  }
};




// Lấy tất cả review theo ProductID
exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Sử dụng populate để lấy thông tin userId với các trường name
    const reviews = await Review.find({ productId }).populate("userId", "name");

    res.status(200).json(reviews);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Lấy danh sách sản phẩm đã được đánh giá bởi người dùng
exports.getReviewedProductsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Lấy userId từ middleware xác thực

    // Tìm tất cả các review của người dùng hiện tại
    const reviews = await Review.find({ userId }).select("productId");

    // Trả về danh sách các productId đã được đánh giá
    const reviewedProducts = reviews.map((review) => review.productId);

    res.status(200).json({ reviewedProducts });
  } catch (error) {
    console.error("Error fetching reviewed products:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Middleware upload file
exports.upload = upload;
