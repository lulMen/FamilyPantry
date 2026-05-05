const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe.model");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Recipe endpoint is working!" });
});

module.exports = router;
