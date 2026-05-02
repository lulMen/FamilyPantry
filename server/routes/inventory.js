const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Inventory endpoint is working!" });
});

module.exports = router;
