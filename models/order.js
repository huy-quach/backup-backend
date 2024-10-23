const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Furniture",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      note: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Completed", "Canceled", "Failed", "Delivered"], // Thêm "Delivered" vào enum
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "momo", "zalopay", "paypal"],
      required: true,
    },
    paymentDetails: {
      transactionId: { type: String }, // Mã giao dịch
      paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"], // Trạng thái thanh toán chi tiết
        default: "Pending",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Ghi lại thời gian tạo và cập nhật đơn hàng
);

module.exports = mongoose.model("Order", orderSchema);
