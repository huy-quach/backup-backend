const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  // Cấu hình cho Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'quach.huy2015@gmail.com', // Thay bằng email của bạn
      pass: 'ebarjzmmmdxcchye',  // Thay bằng mật khẩu email của bạn
    },
  });

  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com', // Thay bằng email của bạn để nhận tin nhắn
    subject: `Liên hệ từ ${name}`,
    text: `Tên: ${name}\nEmail: ${email}\nSố điện thoại: ${phone}\nTin nhắn: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Tin nhắn đã được gửi!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi khi gửi tin nhắn.' });
  }
});

module.exports = router;
