const express = require("express");
const router = express.Router();
const GroceryList = require("../models/GroceryList");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Grocery List endpoint is working!" });
});

module.exports = router;
