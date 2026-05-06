const express = require("express");
const router = express.Router();

const pantryController = require("../controllers/pantry.controller");

router.get("/test", pantryController.testAPI);

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Pantry endpoint is working!" });
});

module.exports = router;
