const User = require("../models/user"); // Model user được sử dụng để lưu giỏ hàng

// Lưu giỏ hàng vào cơ sở dữ liệu
const saveCart = async (req, res) => {
  try {
    const { cart } = req.body;

    console.log("Saving cart:", cart); // Kiểm tra log dữ liệu cart trước khi lưu
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { cart }, // Đảm bảo rằng cart bao gồm cả 'description'
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart); // Trả về giỏ hàng đã lưu
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy giỏ hàng từ cơ sở dữ liệu
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa giỏ hàng sau khi thanh toán
const clearCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { cart: [] }, // Làm trống giỏ hàng của người dùng trong database
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Cart cleared successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveCart, getCart, clearCart };
