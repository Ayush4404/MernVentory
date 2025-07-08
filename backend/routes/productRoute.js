const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getInventoryStats,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/stats/inventory", protect, getInventoryStats);

router
  .route("/")
  .post(protect, upload.single("image"), createProduct)
  .get(protect, getProducts);

router
  .route("/:id")
  .get(protect, getProduct)
  .patch(protect, upload.single("image"), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
