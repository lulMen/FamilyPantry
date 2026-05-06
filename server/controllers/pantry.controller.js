const Pantry = require("../models/pantry.model");

const getAllPantryItems = async (req, res) => {
  const items = await Pantry.find({});
  res.status(200).json(items);
};

const getPantryItemById = async (req, res) => {
  const item = await Pantry.findById(req.params.id).orFail();
  res.status(200).json(item);
};

const createPantryItem = async (req, res) => {
  const item = new Pantry(req.body);
  await item.save();
  res.status(201).json(item);
};

const updatePantryItem = async (req, res) => {
  const item = await Pantry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).orFail();
  res.status(200).json(item);
};

const deletePantryItem = async (req, res) => {
  await Pantry.findByIdAndDelete(req.params.id).orFail();
  res.status(200).json({ message: "Item deleted successfully" });
};

module.exports = {
  getAllPantryItems,
  getPantryItemById,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
};
