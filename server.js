require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken"); // Import jwt
const contactRoutes = require("./routes/contactRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const furnitureRoutes = require("./routes/furnitureRoutes");
const orderRoutes = require("./routes/orderRoutes");
const carouselRoutes = require("./routes/carouselRoutes");
const momoRoutes = require("./routes/momoRoutes");
const zalopayRoutes = require("./routes/zalopayRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
require("./config/passport");

const app = express();

// Cấu hình session cho passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

app.use("/api/carousels", carouselRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/contact", contactRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Database connection error:", err));

app.use("/api/furniture", furnitureRoutes);

app.use("/api/inventory", inventoryRoutes);
// Route xác thực bằng Facebook
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
app.use("/api/orders", orderRoutes);
// Route callback sau khi xác thực bằng Facebook

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    // Tạo JWT token từ thông tin người dùng
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, name: req.user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const user = {
      name: req.user.name,
      email: req.user.email,
    };

    // Thay đổi URL để chuyển hướng về frontend trên cổng 5001
    res.redirect(
      `http://localhost:5001/?token=${token}&name=${user.name}&email=${user.email}`
    );
  }
);
app.use("/api/users", userRoutes);
const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);
const testimonialRoutes = require("./routes/testimonialRoutes");
// Sử dụng route testimonials

app.use("/api/momo", momoRoutes);
app.use("/api/zalopay", zalopayRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Phục vụ các file tĩnh từ thư mục build của Vue.js (frontend)
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/auth/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      // eslint-disable-next-line no-undef
      return next(err);
    }
    res.redirect("/"); // Chuyển hướng về trang chủ sau khi logout
  });
});

app.use(
  cors({
    origin: "http://localhost:5001", // Thay bằng địa chỉ frontend của bạn
    credentials: true,
  })
);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
