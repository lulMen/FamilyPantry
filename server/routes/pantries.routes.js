const express = require("express");
const router = express.Router();

const pantryController = require("../controllers/pantry.controller");

// Define routes for pantry items
router.get("/", pantryController.getAllPantryItems);
router.get("/:id", pantryController.getPantryItemById);
router.post("/", pantryController.createPantryItem);
router.put("/:id", pantryController.updatePantryItem);
router.delete("/:id", pantryController.deletePantryItem);

module.exports = router;
