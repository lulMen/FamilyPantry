const express = require("express");
const router = express.Router();
const GroceryListItem = require("../models/GroceryListItem");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Grocery List Item endpoint is working!" });
});

module.exports = router;
