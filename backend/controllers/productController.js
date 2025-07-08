const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc    Create Product

const createProduct = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, category, price, quantity } = req.body;

    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imagePath = req.file ? req.file.path : "https://via.placeholder.com/150";

    const product = await Product.create({
      name,
      category,
      price,
      quantity,
      image: imagePath,
      user: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Product creation failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



//    Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(products);
});

//     Get Single Product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  res.status(200).json(product);
});

//   Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updated);
});

//   Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully" });
});


//inventory stats
const getInventoryStats = asyncHandler(async (req, res) => {
    
  const products = await Product.find({ user: req.user._id });

  const totalProducts = products.length;

  const totalStoreValue = products.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const outOfStock = products.filter(p => p.quantity === 0).length;

  const categories = [...new Set(products.map(p => p.category))];

  res.status(200).json({
    totalProducts,
    totalStoreValue,
    outOfStock,
    categories: categories.length,
  });
    // res.send("inventory");
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getInventoryStats,
};
