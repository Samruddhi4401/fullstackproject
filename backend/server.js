const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 📦 Load environment variables
dotenv.config();

// 🔗 Connect to MongoDB
connectDB();

const app = express();

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "https://my-grocery-app-2025.netlify.app", // ✅ Production (Netlify)
  "http://127.0.0.1:5500",                   // ✅ Local (VS Code Live Server)
  "http://localhost:5500",                   // ✅ Alternate localhost
  "http://localhost:3000",                   // ✅ Local React dev
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 Incoming Origin:", origin); // Log origin for debugging

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

// ✅ Middleware to handle JSON and form data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));         // 🔐 Auth routes
app.use("/api/products", require("./routes/products")); // 🛍 Product routes
app.use("/api/orders", require("./routes/orders"));     // 📦 Order routes

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🛒 Grocery API is running...");
});

// ❌ 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ message: "❌ Internal Server Error", error: err.message });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
