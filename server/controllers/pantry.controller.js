const Pantry = require("../models/pantry.model");

testAPI = async (req, res) => {
  res.status(200).json({ message: "Pantry endpoint #02 is working!" });
};

getAllPantryItems = async (req, res) => {
  const items = await Pantry.find({}).orFail();
  res.status(200).json(items);
};

getPantryItemById = async (req, res) => {
  const item = await Pantry.findById(req.params.id).orFail();
  res.status(200).json(item);
};

createPantryItem = async (req, res) => {
  const item = new Pantry(req.body);
  await item.save();
  res.status(201).json(item);
};

updatePantryItem = async (req, res) => {
  const item = await Pantry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).orFail();
  res.status(200).json(item);
};

deletePantryItem = async (req, res) => {
  await Pantry.findByIdAndDelete(req.params.id).orFail();
  res.status(200).json({ message: "Item deleted successfully" });
};

module.exports = {
  testAPI,
  getAllPantryItems,
  getPantryItemById,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
};
