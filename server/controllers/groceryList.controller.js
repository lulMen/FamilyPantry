const GroceryList = require("../models/GroceryList.model");
const GroceryListItem = require("../models/GroceryListItem.model");
const Recipe = require("../models/Recipe.model");
const Pantry = require("../models/Pantry.model");

const getAllGroceryLists = async (req, res) => {
  const lists = await GroceryList.find({});
  res.status(200).json(lists);
};

const getGroceryListById = async (req, res) => {
  const list = await GroceryList.findById(req.params.id).orFail();
  res.status(200).json(list);
};

const createGroceryList = async (req, res) => {
  const list = await GroceryList.create(req.body);
  res.status(201).json(list);
};

const updateGroceryList = async (req, res) => {
  const list = await GroceryList.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).orFail();
  res.status(200).json(list);
};

const deleteGroceryList = async (req, res) => {
  await GroceryList.findByIdAndDelete(req.params.id).orFail();
  await GroceryListItem.deleteMany({ listId: req.params.id });
  res.status(200).json({ message: "Grocery list deleted successfully" });
};

// POST /api/grocery-lists/from-recipe/:recipeId
// Cross-references recipe ingredients against pantry stock and generates a list
const createFromRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.recipeId).orFail();
  const pantryItems = await Pantry.find({});

  const itemsToCreate = [];

  for (const ingredient of recipe.ingredients) {
    // Sum all pantry items matching this ingredient name (case-insensitive)
    const pantryMatches = pantryItems.filter(
      (p) => p.name.toLowerCase() === ingredient.name.toLowerCase(),
    );
    const totalInPantry = pantryMatches.reduce((sum, p) => sum + p.quantity, 0);
    const needed = ingredient.ingredientsQuantity;

    if (totalInPantry < needed) {
      itemsToCreate.push({
        itemName: ingredient.name,
        quantityNeeded: needed - totalInPantry,
        measurement: ingredient.ingredientsMeasurements,
        status: "Pending",
      });
    }
  }

  // Create the list
  const list = await GroceryList.create({
    listName: `${recipe.name} — Shopping List`,
    recipeId: recipe._id,
  });

  // Attach listId to each item and bulk insert
  const items = itemsToCreate.map((item) => ({ ...item, listId: list._id }));
  const createdItems =
    items.length > 0 ? await GroceryListItem.insertMany(items) : [];

  res.status(201).json({ list, items: createdItems });
};

module.exports = {
  getAllGroceryLists,
  getGroceryListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
  createFromRecipe,
};
