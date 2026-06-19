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

  const list = await GroceryList.create({
    listName: `${recipe.name} — Shopping List`,
    recipeId: recipe._id,
  });

  const items = itemsToCreate.map((item) => ({ ...item, listId: list._id }));
  const createdItems =
    items.length > 0 ? await GroceryListItem.insertMany(items) : [];

  res.status(201).json({ list, items: createdItems });
};

// POST /api/grocery-lists/:id/purchase
// Converts all "Purchased" + unlocked items on this list into new Pantry entries,
// then locks those items so their status can no longer be changed.
const purchaseList = async (req, res) => {
  const list = await GroceryList.findById(req.params.id).orFail();

  const itemsToConvert = await GroceryListItem.find({
    listId: list._id,
    status: "Purchased",
    locked: { $ne: true },
  });

  if (itemsToConvert.length === 0) {
    return res
      .status(200)
      .json({ message: "No purchased items to process.", pantryItems: [] });
  }

  const pantryDocs = itemsToConvert.map((item) => ({
    name: item.itemName,
    quantity: item.quantityNeeded,
    measurement: item.measurement || "each",
    storageType: item.type || "Dry",
    acquiredDate: new Date(),
  }));

  const createdPantryItems = await Pantry.insertMany(pantryDocs);

  await GroceryListItem.updateMany(
    { _id: { $in: itemsToConvert.map((i) => i._id) } },
    { $set: { locked: true } },
  );

  res.status(200).json({
    message: `${createdPantryItems.length} item(s) added to pantry.`,
    pantryItems: createdPantryItems,
  });
};

module.exports = {
  getAllGroceryLists,
  getGroceryListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
  createFromRecipe,
  purchaseList,
};
