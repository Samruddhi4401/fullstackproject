const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { verifyToken, isAdmin } = require("../middleware/auth");

// ✅ GET all products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error: " + err.message });
  }
});

// ✅ GET single product by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "❌ Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "❌ Server error: " + err.message });
  }
});

// ✅ POST: Add a new product (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ error: "❌ Name, price, and image are required" });
  }

  try {
    const newProduct = new Product({ name, price, image, stock: 1 });
    await newProduct.save();
    res.status(201).json({ message: "✅ Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to add product: " + err.message });
  }
});

// ✅ POST alias route (/add) for flexibility
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ error: "❌ Name, price, and image are required" });
  }

  try {
    const newProduct = new Product({ name, price, image, stock: 1 });
    await newProduct.save();
    res.status(201).json({ message: "✅ Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to add product: " + err.message });
  }
});

// ✅ PUT: Update product (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { name, price, image } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "❌ Product not found" });
    res.json({ message: "✅ Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "❌ Update failed: " + err.message });
  }
});

// ✅ PUT: Toggle stock (Admin only)
router.put("/:id/stock", verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "❌ Product not found" });

    product.stock = product.stock === 1 ? 0 : 1;
    await product.save();

    res.json({ message: "✅ Stock status updated", stock: product.stock });
  } catch (err) {
    res.status(500).json({ error: "❌ Stock toggle failed: " + err.message });
  }
});

// ✅ DELETE: Remove product (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "❌ Product not found" });
    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "❌ Delete failed: " + err.message });
  }
});

module.exports = router;
