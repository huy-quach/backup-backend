const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      // Giá gốc khi nhập hàng
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Ghế", "Bàn", "Giường Ngủ", "Salon Phòng Khách", "Bếp Ăn"], // Giới hạn giá trị category
      required: true,
    },
    quantity: {
      // Số lượng sản phẩm
      type: Number,
      required: true,
      min: 0, // Không cho phép giá trị âm
    },
    material: {
      // Chất liệu của sản phẩm
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    image: {
      // Trường lưu trữ đường dẫn hình ảnh
      type: String,
      default: "no-image.jpg", // Giá trị mặc định nếu không có ảnh
    },
    active: {
      // Trường xác định sản phẩm có đang hoạt động hay không
      type: Boolean,
      default: true, // Mặc định sản phẩm sẽ được hiển thị
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Furniture", furnitureSchema);
