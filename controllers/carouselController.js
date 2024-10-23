const Carousel = require("../models/carousel");

// Lấy tất cả các carousel
exports.getAllCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find();
    res.status(200).json(carousels);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch carousels" });
  }
};

// Lấy một carousel cụ thể
exports.getCarouselById = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }
    res.status(200).json(carousel);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch carousel" });
  }
};

// Tạo carousel mới
exports.createCarousel = async (req, res) => {
  console.log("Received request to create carousel:", req.body, req.file);
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !content || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCarousel = new Carousel({ title, content, image });
    await newCarousel.save();
    res.status(201).json(newCarousel);
  } catch (error) {
    console.error("Error creating carousel:", error);
    res.status(500).json({ message: "Failed to create carousel" });
  }
};


// Cập nhật carousel
exports.updateCarousel = async (req, res) => {
  const { title, content } = req.body;
  let image = null;

  try {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) {
      return res.status(404).json({ message: "Carousel not found" });
    }

    // Kiểm tra xem có file mới được upload không
    if (req.file) {
      image = req.file.filename;
    } else {
      image = carousel.image; // Giữ nguyên hình ảnh hiện tại
    }

    carousel.title = title || carousel.title;
    carousel.content = content || carousel.content;
    carousel.image = image;

    await carousel.save();
    res.status(200).json(carousel);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Failed to update carousel" });
  }
};

exports.deleteCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findByIdAndDelete(req.params.id);
    if (!carousel)
      return res.status(404).json({ message: "Carousel not found" });
    res.status(200).json({ message: "Carousel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


