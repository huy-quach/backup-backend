const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const Order = require("../models/order"); // Import the order model

// Config from your .env
const ZALOPAY_APP_ID = process.env.ZALOPAY_APP_ID;
const ZALOPAY_KEY1 = process.env.ZALOPAY_KEY1;
const ZALOPAY_ENDPOINT = process.env.ZALOPAY_ENDPOINT;

exports.createPayment = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const totalAmount = req.body.totalAmount;
    const shippingAddress = req.body.shippingAddress;
    const userId = req.user._id; // The authenticated user

    // Generate a transaction ID for ZaloPay
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: ZALOPAY_APP_ID,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // Transaction ID
      app_user: "user123", // User ID or email
      app_time: Date.now(), // Current time
      item: JSON.stringify(
        req.body.products.map((product) => ({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: `http://localhost:5000/uploads/${product.image}`, // Product image path
        }))
      ), // Product details
      embed_data: JSON.stringify({}),
      amount: totalAmount,
      description: `Payment for order #${orderId}`,
      bank_code: "zalopayapp",
      callback_url: `https://ab30-113-180-170-89.ngrok-free.app/api/zalopay/callback`, // Your ngrok forwarding URL
    };

    // Generate the MAC signature
    const data = `${ZALOPAY_APP_ID}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    console.log("Data for MAC:", data); // Log dữ liệu tính toán MAC
    order.mac = CryptoJS.HmacSHA256(data, ZALOPAY_KEY1).toString();
    console.log("Generated MAC:", order.mac); // Log MAC được tạo ra

    // Send payment request to ZaloPay
    const response = await axios.post(ZALOPAY_ENDPOINT, null, {
      params: order,
    });
    console.log("Response from ZaloPay:", response.data); // Log phản hồi từ ZaloPay

    // Save the order in the database with 'pending' status
    const newOrder = new Order({
      orderId,
      totalAmount,
      shippingAddress,
      paymentMethod: "zalopay",
      status: "pending",
      user: userId,
    });

    await newOrder.save();

    // Respond with the payment URL from ZaloPay
    return res.status(200).json({ payUrl: response.data.order_url });
  } catch (error) {
    console.error("Error creating ZaloPay payment:", error);
    return res.status(500).json({ error: "Failed to create ZaloPay payment" });
  }
};

exports.handleCallback = async (req, res) => {
  let result = {};
  console.log(req.body); // Log để kiểm tra dữ liệu nhận từ ZaloPay

  try {
    const { data, mac } = req.body;

    // Tính toán MAC với key2
    const key2 = process.env.ZALOPAY_KEY2; // Đảm bảo bạn đã thiết lập biến môi trường cho key
    console.log("Dữ liệu nhận từ ZaloPay:", data);
    console.log("MAC nhận từ ZaloPay:", mac);
    const calculatedMac = CryptoJS.HmacSHA256(data, key2).toString();
    console.log("MAC tính toán:", calculatedMac);

    // Kiểm tra tính hợp lệ của MAC
    if (calculatedMac !== mac) {
      result.return_code = -1;
      result.return_message = "MAC không hợp lệ";
      return res.status(403).json(result);
    }

    // Parse data JSON từ req.body.data
    const parsedData = JSON.parse(data);
    const { app_trans_id, zp_trans_id, status } = parsedData;

    // Tìm đơn hàng dựa trên app_trans_id (cần ánh xạ orderId với app_trans_id)
    const order = await Order.findOne({ orderId: app_trans_id });
    if (!order) {
      result.return_code = -1;
      result.return_message = "Không tìm thấy đơn hàng";
      return res.status(404).json(result);
    }

    // Cập nhật trạng thái đơn hàng dựa trên trạng thái thanh toán từ ZaloPay
    order.paymentDetails.transactionId = zp_trans_id; // Mã giao dịch ZaloPay

    if (status === 1) {
      order.orderStatus = "Completed"; // Thanh toán thành công
      order.paymentDetails.paymentStatus = "Completed"; // Cập nhật trạng thái chi tiết thanh toán
    } else {
      order.orderStatus = "Failed"; // Thanh toán thất bại
      order.paymentDetails.paymentStatus = "Failed"; // Cập nhật trạng thái chi tiết thanh toán
    }

    await order.save();
    result.return_code = 1;
    result.return_message = "Xử lý callback thành công";
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi xử lý callback từ ZaloPay:", error);
    result.return_code = 0; // ZaloPay sẽ gọi lại (tối đa 3 lần)
    result.return_message = error.message;
    return res.status(500).json(result);
  }
};
