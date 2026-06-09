const Recipe = require("../models/Recipe.model");
const { fetchNutritionData } = require("../utils/edamam.utils");

const getAllRecipes = async (req, res) => {
  const recipes = await Recipe.find({});
  res.status(200).json(recipes);
};

const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).orFail();
  res.status(200).json(recipe);
};

const createRecipe = async (req, res) => {
  const recipeData = { ...req.body };

  if (recipeData.ingredients?.length) {
    const nutrition = await fetchNutritionData(recipeData.ingredients);
    if (nutrition) Object.assign(recipeData, nutrition);
  }

  const recipe = await Recipe.create(recipeData);
  res.status(201).json(recipe);
};

const updateRecipe = async (req, res) => {
  const updateData = { ...req.body };

  if (updateData.ingredients?.length) {
    const nutrition = await fetchNutritionData(updateData.ingredients);
    if (nutrition) Object.assign(updateData, nutrition);
  }

  const recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).orFail();

  res.status(200).json(recipe);
};

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
