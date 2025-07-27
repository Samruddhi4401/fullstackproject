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

// ✅ CORS Configuration
const allowedOrigins = [
  "https://my-grocery-app-2025.netlify.app",   // ✅ Your Netlify frontend
  "http://localhost:3000",                     // (Optional: for local testing)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Middleware to handle JSON and form payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));         // User login/signup
app.use("/api/products", require("./routes/products")); // Product management
app.use("/api/orders", require("./routes/orders"));     // Order handling

// 🧪 Health check route
app.get("/", (req, res) => {
  res.send("🛒 Grocery API is running...");
});

// ❌ 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ message: "❌ Internal Server Error", error: err.message });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
