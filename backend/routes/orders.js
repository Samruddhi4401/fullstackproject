const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🛡️ JWT Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "❌ Not authenticated. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id, role }
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    return res.status(403).json({ message: "❌ Invalid or expired token." });
  }
};

// ✅ GET /api/orders/test - Test Route to check if backend is working
router.get("/test", (req, res) => {
  res.send("✅ Orders route working!");
});

// 🛒 POST /api/orders - Create Order
router.post("/", authMiddleware, async (req, res) => {
  const { items, address } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "❌ Order must contain at least one item." });
  }

  for (const item of items) {
    if (!item.name || !item.price || !item.quantity) {
      return res.status(400).json({ message: "❌ Each item must have name, price, and quantity." });
    }
  }

  if (!address || address.trim() === "") {
    return res.status(400).json({ message: "❌ Address is required." });
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    // ✅ Fetch full user details
    const userData = await User.findById(req.user.id).select("name email");
    if (!userData) {
      return res.status(404).json({ message: "❌ User not found." });
    }

    // ✅ Create new order
    const order = new Order({
      user: {
        name: userData.name,
        email: userData.email,
        id: userData._id,
      },
      items,
      address,
      totalAmount,
      status: "Pending",
    });

    await order.save();

    res.status(201).json({
      message: "✅ Order placed successfully!",
      order,
    });
  } catch (err) {
    console.error("❌ Order Creation Error:", err.message);
    res.status(500).json({ message: "❌ Server error while placing order." });
  }
});

// 📦 GET /api/orders - Admin View All Orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ message: "❌ Access denied. Admins only." });
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Order Fetch Error:", err.message);
    res.status(500).json({ message: "❌ Server error fetching orders." });
  }
});

module.exports = router;
