const express = require("express");
const router = express.Router();
const groceryListController = require("../controllers/groceryList.controller");

router.get("/", groceryListController.getAllGroceryLists);
router.get("/:id", groceryListController.getGroceryListById);
router.post("/", groceryListController.createGroceryList);
router.post("/from-recipe/:recipeId", groceryListController.createFromRecipe);
router.put("/:id", groceryListController.updateGroceryList);
router.delete("/:id", groceryListController.deleteGroceryList);

module.exports = router;
