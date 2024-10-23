const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Định nghĩa schema cho từng sản phẩm trong giỏ hàng
const cartItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Furniture", // Tham chiếu tới sản phẩm trong giỏ hàng (giả sử bạn có model 'Furniture')
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  image: {
    type: String, // Đường dẫn tới hình ảnh sản phẩm
  },
  material: {
    type: String, // Thêm thuộc tính material cho sản phẩm
    required: true, // Có thể là required tùy vào yêu cầu
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Không yêu cầu mật khẩu cho người dùng đăng nhập qua Facebook
      required: function () {
        return !this.facebookId;
      },
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép bỏ qua nếu không có FacebookId
    },
    role: {
      type: String,
      enum: ["user", "employee", "admin"],
      default: "user", // Mặc định người dùng mới đăng ký là 'user'
    },
    cart: [cartItemSchema], // Giỏ hàng là một mảng các sản phẩm với schema đã cập nhật
  },
  {
    timestamps: true,
  }
);

// Mã hóa mật khẩu trước khi lưu vào database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next(); // Nếu không thay đổi mật khẩu, bỏ qua bước mã hóa
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Gọi next() sau khi hoàn tất quá trình mã hóa
  } catch (err) {
    return next(err); // Trả về lỗi nếu có vấn đề trong quá trình mã hóa
  }
});

// So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
