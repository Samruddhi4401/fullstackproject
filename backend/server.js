const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config(); // Load .env

// 🔗 Connect to MongoDB
connectDB();

const app = express();

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "https://my-grocery-app-2025.netlify.app", // ✅ Deployed frontend (Netlify)
  "http://127.0.0.1:5500",                   // ✅ Local frontend (Live Server)
  "http://localhost:3000",                  // ✅ React dev or other local clients
];

// ✅ CORS Setup
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 Incoming Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Not allowed by CORS:", origin);
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));         // 🔐 Auth
app.use("/api/products", require("./routes/products")); // 🛍 Products
app.use("/api/orders", require("./routes/orders"));     // 📦 Orders

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🛒 Grocery API is live and running.");
});

// ❌ 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ message: "❌ Internal Server Error", error: err.message });
});

// 🚀 Launch server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
