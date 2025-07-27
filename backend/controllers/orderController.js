const Order = require("../models/Order");

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
    });
    await order.save();
    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: "Error placing order" });
  }
};

// GET /api/orders/my-orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching your orders" });
  }
};

// GET /api/orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching all orders" });
  }
};

// PUT /api/orders/:id/status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = req.body.status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: "Error updating status" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
