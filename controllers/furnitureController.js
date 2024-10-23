const Furniture = require("../models/furniture");
const multer = require("multer");
const path = require("path");
// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the "uploads" folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Lưu tên file với thời gian để đảm bảo duy nhất
  },
});

exports.upload = multer({ storage: storage });
// Lọc sản phẩm theo loại
exports.getFurnitureByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const furniture = await Furniture.find({ category });
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả các sản phẩm hoặc theo phân loại
exports.getAllFurniture = async (req, res) => {
  const { category } = req.query;

  let filter = { active: true }; // Chỉ lấy các sản phẩm có active: true
  if (category) {
    filter.category = category;
  }

  try {
    const furniture = await Furniture.find(filter);
    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateFurniture = async (req, res) => {
  try {
    const { name, description, category, material } = req.body;

    const image = req.file ? req.file.filename : req.body.image;

    const updatedData = {
      name,
      description,
      category,
      material,
      image,
    };

    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.hideFurniture = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Cập nhật trạng thái active của sản phẩm thành false
    const product = await Furniture.findByIdAndUpdate(
      productId,
      { active: false }, // Chuyển active thành false để ẩn sản phẩm
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Bạn không cần phải cập nhật `Inventory` ở đây

    res.json({ message: "Product hidden successfully", product });
  } catch (error) {
    console.error("Error hiding product:", error);
    res.status(500).json({ error: "Failed to hide product" });
  }
};
exports.getHiddenFurniture = async (req, res) => {
  try {
    const hiddenFurniture = await Furniture.find({ active: false });
    res.json(hiddenFurniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.unhideFurniture = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Furniture.findByIdAndUpdate(
      productId,
      { active: true }, // Cập nhật trạng thái active thành true
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product unhidden successfully", product });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Failed to unhide product" });
  }
};






// Lấy chi tiết sản phẩm theo ID
exports.getFurnitureById = async (req, res) => {
  try {
    const product = await Furniture.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mua sản phẩm và trừ số lượng
exports.buyFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found" });
    }

    if (furniture.quantity >= req.body.quantity) {
      furniture.quantity -= req.body.quantity;
      await furniture.save();
      res.json(furniture);
    } else {
      res.status(400).json({ message: "Not enough stock available" });
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.countFurniture = async (req, res) => {
  try {
    const furnitureCount = await Furniture.countDocuments({ active: true }); // Đếm tổng số sản phẩm
    res.status(200).json({ count: furnitureCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API tìm kiếm sản phẩm theo tên và phân loại
exports.searchFurniture = async (req, res) => {
  try {
    const query = req.query.query || ""; // Lấy từ khóa tìm kiếm từ query params

    // Nếu không có từ khóa, trả về danh sách trống
    if (!query) {
      return res.status(200).json([]);
    }

    // Tạo điều kiện tìm kiếm, tìm các sản phẩm mà từ khóa xuất hiện ở đầu tên
    const searchConditions = {
      name: { $regex: `^${query}`, $options: "i" }, // Sử dụng ^ để đảm bảo chuỗi bắt đầu bằng từ khóa
    };

    // Tìm kiếm các sản phẩm phù hợp
    const results = await Furniture.find(searchConditions);

    // Trả về kết quả bao gồm hình ảnh, tên, và giá
    res.status(200).json(results);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};



