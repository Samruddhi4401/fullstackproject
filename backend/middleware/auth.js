const jwt = require("jsonwebtoken");

// Use fallback secret if not set in .env
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// ✅ Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // case-sensitive: lowercase in Express

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "❌ Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Get token part

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id, role, etc.)
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ error: "❌ Invalid or expired token." });
  }
};

// ✅ Middleware: Allow Only Admin Role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "❌ Access denied. Admins only." });
  }
};

module.exports = { verifyToken, isAdmin };
