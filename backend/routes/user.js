const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

// ============================
// @route   GET /api/users/profile
// @desc    Get current logged-in user's profile
// @access  Private
// ============================
router.get("/profile", auth, getUserProfile);

// ============================
// @route   PUT /api/users/profile
// @desc    Update current logged-in user's profile
// @access  Private
// ============================
router.put("/profile", auth, updateUserProfile);

// ============================
// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
// ============================
router.get("/", auth, isAdmin, getAllUsers);

// ============================
// @route   DELETE /api/users/:id
// @desc    Delete user by ID (Admin only)
// @access  Private/Admin
// ============================
router.delete("/:id", auth, isAdmin, deleteUser);

module.exports = router;
