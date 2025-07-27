const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: "Feedback received!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
