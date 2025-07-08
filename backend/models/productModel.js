const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    sku: {
      type: String,
      default: "SKU-" + Date.now(),
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    description: {
      type: String,
      default: "No description",
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
