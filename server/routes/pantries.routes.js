const express = require("express");
const router = express.Router();
const Pantry = require("../models/Pantry.model");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Inventory endpoint is working!" });
});

module.exports = router;
