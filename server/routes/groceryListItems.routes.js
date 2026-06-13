const express = require("express");
const router = express.Router();
const groceryListItemController = require("../controllers/groceryListItem.controller");

router.get("/", groceryListItemController.getItemsByListId);
router.get("/all", groceryListItemController.getAllGroceryListItems);
router.get("/:id", groceryListItemController.getGroceryListItemById);
router.post("/", groceryListItemController.createGroceryListItem);
router.put("/:id", groceryListItemController.updateGroceryListItem);
router.delete("/:id", groceryListItemController.deleteGroceryListItem);

module.exports = router;
