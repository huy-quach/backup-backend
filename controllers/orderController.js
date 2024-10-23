const Order = require("../models/order");
const Furniture = require("../models/furniture");
const Inventory = require("../models/inventory");
// Hàm để cập nhật số lượng trong Inventory sau khi mua hàng
exports.updateInventoryAfterPurchase = async (products) => {
  for (const item of products) {
    const inventoryItem = await Inventory.findOne({ product: item.product });

    if (inventoryItem) {
      inventoryItem.quantity -= item.quantity; // Trừ số lượng trong kho
      if (inventoryItem.quantity < 0) {
        inventoryItem.quantity = 0; // Đảm bảo số lượng không âm
      }
      await inventoryItem.save(); // Lưu lại thay đổi vào database
    }
  }
};
exports.updateFurnitureQuantityAfterPurchase = async (products) => {
  for (const item of products) {
    const furnitureItem = await Furniture.findById(item.product);

    if (furnitureItem) {
      furnitureItem.quantity -= item.quantity; // Trừ số lượng trong bảng furniture
      if (furnitureItem.quantity < 0) {
        furnitureItem.quantity = 0; // Đảm bảo số lượng không âm
      }
      await furnitureItem.save(); // Lưu lại thay đổi vào database
    }
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
    } = req.body;

    // Cập nhật số lượng trong Inventory
    await exports.updateInventoryAfterPurchase(products);

    // Cập nhật số lượng trong Furniture
    await exports.updateFurnitureQuantityAfterPurchase(products);

    // Sau khi cập nhật, lưu Order
    const newOrder = new Order({
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      user: req.user._id,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};


// Lấy danh sách đơn hàng của người dùng
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product", // Tham chiếu tới sản phẩm
      "name price image" // Bao gồm trường image cùng với name và price
    );
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  order.orderStatus = orderStatus;
  await order.save();
  res.json(order);
};
exports.getAllOrders = async (req, res) => {
  try {
    // Admin sẽ lấy tất cả các đơn hàng, không chỉ dựa trên user._id
    const orders = await Order.find().populate("user", "name email").populate(
      "products.product", // Tham chiếu tới sản phẩm
      "name price image" // Bao gồm trường image cùng với name và price
    );

    res.json(orders); // Trả về danh sách tất cả các đơn hàng
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};
exports.updateQuantityAfterPurchase = async (products) => {
  for (const item of products) {
    const furniture = await Furniture.findById(item.product);
    if (furniture) {
      // Trừ số lượng sản phẩm
      furniture.quantity -= item.quantity;
      await furniture.save(); // Lưu cập nhật vào database
    }
  }
};
exports.checkOrderStatus = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ userId, "items.productId": productId });
    if (order) {
      res.status(200).json({ status: order.status });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to check order status", error });
  }
};
// Đếm tổng số đơn hàng
exports.countOrders = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments(); // Đếm tổng số đơn hàng
    res.status(200).json({ count: orderCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to count orders", error });
  }
};