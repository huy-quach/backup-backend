const Blog = require("../models/blog");
// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Check the request body
    console.log("Request File:", req.file); // Check the uploaded file

    const { title, content, author, category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const blog = new Blog({
      title,
      content,
      author,
      category,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category } = req.query; // Lấy category từ query string
    const filter = category ? { category } : {}; // Nếu có category, thêm điều kiện lọc

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    // Log dữ liệu nhận được từ request
    console.log("Update request body:", req.body);
    console.log("Update request file:", req.file); // Xem có file ảnh không

    const updateData = { title, content, author, category };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm một người dùng vào danh sách voters và kiểm tra xem người đó đã like trước đó chưa
exports.likeBlog = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user ID từ token
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Kiểm tra nếu user đã like bài viết
    if (blog.likers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this blog" });
    }

    // Tăng 1 like và thêm user vào danh sách likers
    blog.likes += 1;
    blog.likers.push(userId);

    await blog.save();
    res.status(200).json({ message: "Blog liked successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error liking blog", error });
  }
};

// Vote Useful
exports.voteUseful = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Kiểm tra nếu user đã vote not useful
    if (blog.notUsefulVoters.includes(userId)) {
      // Xóa user khỏi danh sách notUsefulVoters và trừ 1 vào not useful
      blog.notUsefulVotes -= 1;
      blog.notUsefulVoters = blog.notUsefulVoters.filter(
        (voter) => voter.toString() !== userId
      );

      // Thêm user vào danh sách usefulVoters và cộng 1 vào useful
      blog.usefulVotes += 1;
      blog.usefulVoters.push(userId);
    } else if (blog.usefulVoters.includes(userId)) {
      // Kiểm tra nếu user đã vote useful trước đó
      return res.status(400).json({ message: "You have already voted useful" });
    } else {
      // Thêm user vào danh sách usefulVoters và cộng 1 vào useful
      blog.usefulVotes += 1;
      blog.usefulVoters.push(userId);
    }

    await blog.save();
    res.status(200).json({ message: "Voted useful successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error voting useful", error });
  }
};

// Vote Not Useful
exports.voteNotUseful = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Kiểm tra nếu user đã vote useful
    if (blog.usefulVoters.includes(userId)) {
      // Xóa user khỏi danh sách usefulVoters và trừ 1 vào useful
      blog.usefulVotes -= 1;
      blog.usefulVoters = blog.usefulVoters.filter(
        (voter) => voter.toString() !== userId
      );

      // Thêm user vào danh sách notUsefulVoters và cộng 1 vào not useful
      blog.notUsefulVotes += 1;
      blog.notUsefulVoters.push(userId);
    } else if (blog.notUsefulVoters.includes(userId)) {
      // Kiểm tra nếu user đã vote not useful trước đó
      return res
        .status(400)
        .json({ message: "You have already voted not useful" });
    } else {
      // Thêm user vào danh sách notUsefulVoters và cộng 1 vào not useful
      blog.notUsefulVotes += 1;
      blog.notUsefulVoters.push(userId);
    }

    await blog.save();
    res.status(200).json({ message: "Voted not useful successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error voting not useful", error });
  }
};
exports.countBlogs = async (req, res) => {
  try {
    const blogCount = await Blog.countDocuments(); // Đếm số lượng blogs
    res.status(200).json({ count: blogCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};









