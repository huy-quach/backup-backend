const Inventory = require("../models/inventory");
const Furniture = require("../models/furniture");


exports.importProducts = async (req, res) => {
  try {
    console.log(req.file); // Kiểm tra nếu file đã được upload

    const item = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      category: req.body.category,
      quantity: req.body.quantity,
      material: req.body.material,
      image: req.file ? req.file.filename : "no-image.jpg", // Kiểm tra nếu có ảnh và lưu tên file vào DB
    };

    let product = await Furniture.findOne({ name: item.productName });

    if (!product) {
      product = new Furniture({
        name: item.productName,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        category: item.category,
        quantity: item.quantity,
        material: item.material,
        image: item.image, // Đảm bảo bạn lưu tên file của ảnh
      });
      await product.save();
    }

    const inventory = new Inventory({
      product: product._id,
      quantity: item.quantity,
      costPrice: item.originalPrice,
      supplier: req.body.supplier,
    });

    await inventory.save();

    res.status(201).json({ message: "Products imported successfully!" });
  } catch (error) {
    console.error("Error importing products:", error);
    res.status(500).json({ error: "Failed to import products" });
  }
};

exports.getAllInventoryItems = async (req, res) => {
  try {
    // Lọc chỉ các sản phẩm active
    const inventoryItems = await Inventory.find({ "product.active": true });
    res.json(inventoryItems);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory" });
  }
};


// Hàm kiểm tra tồn kho
exports.getInventory = async (req, res) => {
  try {
    // Populating full product details from Furniture model, including all relevant fields
    const inventory = await Inventory.find().populate({
      path: "product",
      match: { active: true }, // Chỉ lấy sản phẩm có active: true
      select:
        "name description price originalPrice category quantity material image", // Populate necessary fields
    });

    // Lọc ra những bản ghi inventory mà sản phẩm đã bị ẩn (không có product)
    const filteredInventory = inventory.filter((item) => item.product !== null);

    res.json(filteredInventory); // Trả về dữ liệu inventory đã được lọc
  } catch (error) {
    console.error("Failed to fetch inventory data:", error);
    res.status(500).json({ error: "Failed to fetch inventory data" });
  }
};




// Hàm kiểm tra tồn kho theo sản phẩm
exports.getProductInventory = async (req, res) => {
  try {
    const productId = req.params.productId;
    const inventory = await Inventory.find({ product: productId }).populate(
      "product"
    );

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "No inventory found for this product" });
    }

    res.json(inventory);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product inventory" });
  }
};
