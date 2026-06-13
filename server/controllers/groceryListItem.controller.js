const GroceryListItem = require("../models/GroceryListItem.model");

const getAllGroceryListItems = async (req, res) => {
  const items = await GroceryListItem.find({});
  res.status(200).json(items);
};

// GET /api/grocery-list-items?listId=xxx
const getItemsByListId = async (req, res) => {
  const { listId } = req.query;
  const items = await GroceryListItem.find({ listId });
  res.status(200).json(items);
};

const getGroceryListItemById = async (req, res) => {
  const item = await GroceryListItem.findById(req.params.id).orFail();
  res.status(200).json(item);
};

const createGroceryListItem = async (req, res) => {
  const item = await GroceryListItem.create(req.body);
  res.status(201).json(item);
};

const updateGroceryListItem = async (req, res) => {
  const item = await GroceryListItem.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  ).orFail();
  res.status(200).json(item);
};

const deleteGroceryListItem = async (req, res) => {
  await GroceryListItem.findByIdAndDelete(req.params.id).orFail();
  res.status(200).json({ message: "Item deleted successfully" });
};

module.exports = {
  getAllGroceryListItems,
  getItemsByListId,
  getGroceryListItemById,
  createGroceryListItem,
  updateGroceryListItem,
  deleteGroceryListItem,
};
