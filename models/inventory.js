const mongoose = require("mongoose");

// Định nghĩa schema cho Inventory (Kho Hàng)
const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Furniture",
    required: true,
  }, // Sản phẩm nhập vào
  quantity: { type: Number, required: true }, // Số lượng nhập
  costPrice: { type: Number, required: true }, // Giá nhập
  salePrice: { type: Number }, // Giá bán tại thời điểm nhập hàng (nếu có)
  entryDate: { type: Date, default: Date.now }, // Ngày nhập hàng
  supplier: { type: String, required: true }, // Nhà cung cấp
});

module.exports = mongoose.model("Inventory", inventorySchema);
