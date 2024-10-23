const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const userController = require("../controllers/userController");


const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.get("/count-employees", userController.countEmployees);

// Đăng ký và đăng nhập không cần xác thực
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Route lấy thông tin người dùng hiện tại
router.get("/me", authenticateToken, userController.getMe); // Thêm hàm getMe

router.put("/profile", authenticateToken, userController.updateUserProfile);

router.get("/orders", authenticateToken, orderController.getOrdersByUser);

// Các route quản lý người dùng chỉ dành cho admin
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  userController.getAllUsers
);

// Admin hoặc chính người dùng mới có quyền cập nhật hoặc xóa thông tin
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  userController.updateUser
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  userController.deleteUser
);

router.get(
  "/employees",
  authenticateToken,
  authorizeRoles("admin"),
  userController.getEmployees
); // Lấy danh sách nhân viên

router.put(
  "/update-role",
  authenticateToken,
  authorizeRoles("admin"),
  userController.updateEmployeeRole
); // Cập nhật role

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  userController.deleteEmployee
); // Xóa nhân viên

router.post(
  "/add-employee",
  authenticateToken,
  authorizeRoles("admin"),
  userController.addEmployee
); // Thêm nhân viên


module.exports = router;
