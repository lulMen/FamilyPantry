const Recipe = require("../models/Recipe.model");

const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find({});
  res.status(200).json(recipes);
};

const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).orFail();
  res.status(200).json(recipe);
};

const createRecipe = async (req, res) => {};

const updateRecipe = async (req, res) => {};

const deleteRecipe = async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id).orFail();
  res.status(200).json({ message: "Recipe deleted successfully" });
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
