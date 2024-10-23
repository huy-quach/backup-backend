const https = require("https");
const crypto = require("crypto");

// Tạo thanh toán qua MoMo
const createMoMoPayment = async (req, res) => {
  try {
    const { orderId, totalAmount } = req.body; // Nhận thông tin đơn hàng từ frontend

    // Thông tin từ MoMo API
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = partnerCode + new Date().getTime();
    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const amount = totalAmount;
    const orderInfo = `Payment for order ${orderId}`;
    const requestType = "captureWallet";
    const extraData = ""; // Dữ liệu bổ sung (nếu có)

    // Tạo chữ ký
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo body yêu cầu
    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    });

    // Cấu hình request HTTPS
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    // Gửi request tới MoMo
    const reqMoMo = https.request(options, (momoRes) => {
      momoRes.setEncoding("utf8");
      let body = "";
      momoRes.on("data", (chunk) => {
        body += chunk;
      });
      momoRes.on("end", () => {
        const jsonResponse = JSON.parse(body);
        if (jsonResponse && jsonResponse.payUrl) {
          res.status(200).json({ payUrl: jsonResponse.payUrl }); // Trả về URL thanh toán cho frontend
        } else {
          res.status(400).json({ message: "Failed to create MoMo payment." });
        }
      });
    });

    reqMoMo.on("error", (e) => {
      console.error(`Problem with MoMo request: ${e.message}`);
      res.status(500).json({ message: "Error creating MoMo payment." });
    });

    // Gửi dữ liệu body đến MoMo
    reqMoMo.write(requestBody);
    reqMoMo.end();
  } catch (error) {
    console.error("MoMo payment error:", error);
    res.status(500).json({ message: "Error creating MoMo payment." });
  }
};

module.exports = { createMoMoPayment };
