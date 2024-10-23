const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decodedToken) => {
      if (err) {
        console.log("Token verification failed:", err); // Log chi tiết lỗi token
        return res.status(403).json({ message: "Invalid token." });
      }

      try {
        const user = await User.findById(decodedToken.id);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        console.log("Authenticated User:", user); // Log user đã xác thực

        req.user = user;
        next();
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        return res.status(500).json({ message: "Server error." });
      }
    }
  );
};

// Phân quyền dựa trên role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Unauthorized: You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
