const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db.config");
const Recipe = require("../models/Recipe.model");

const recipes = [
  {
    name: "Garlic Butter Chicken",
    description:
      "A simple pan-seared chicken breast with a rich garlic butter sauce.",
    ingredients: [
      {
        name: "Chicken Breast",
        ingredientsQuantity: 2,
        ingredientsMeasurements: "each",
      },
      {
        name: "Butter",
        ingredientsQuantity: 2,
        ingredientsMeasurements: "tablespoon",
      },
      {
        name: "Garlic Cloves",
        ingredientsQuantity: 4,
        ingredientsMeasurements: "each",
      },
      {
        name: "Olive Oil",
        ingredientsQuantity: 1,
        ingredientsMeasurements: "tablespoon",
      },
      {
        name: "Salt",
        ingredientsQuantity: 1,
        ingredientsMeasurements: "teaspoon",
      },
    ],
    instructions: [
      { description: "Season chicken breasts on both sides with salt." },
      { description: "Heat olive oil in a skillet over medium-high heat." },
      {
        description:
          "Sear chicken for 6-7 minutes per side until cooked through. Remove and set aside.",
      },
      {
        description:
          "Reduce heat to medium. Add butter and minced garlic to the same pan.",
      },
      {
        description:
          "Cook garlic for 1-2 minutes, then return chicken to the pan and spoon sauce over it.",
      },
    ],
    notes: [
      { description: "Pairs well with roasted vegetables or rice." },
      {
        description:
          "Pound chicken to even thickness for more consistent cooking.",
      },
    ],
    prepTime: 10,
    cookTime: 20,
  },
  {
    name: "Black Bean Tacos",
    description:
      "Quick vegetarian tacos with seasoned black beans, fresh toppings, and warm tortillas.",
    ingredients: [
      {
        name: "Black Beans",
        ingredientsQuantity: 2,
        ingredientsMeasurements: "cup",
      },
      {
        name: "Corn Tortillas",
        ingredientsQuantity: 8,
        ingredientsMeasurements: "each",
      },
      {
        name: "Cumin",
        ingredientsQuantity: 1,
        ingredientsMeasurements: "teaspoon",
      },
      {
        name: "Chili Powder",
        ingredientsQuantity: 1,
        ingredientsMeasurements: "teaspoon",
      },
      { name: "Lime", ingredientsQuantity: 1, ingredientsMeasurements: "each" },
      {
        name: "Shredded Cheese",
        ingredientsQuantity: 0.5,
        ingredientsMeasurements: "cup",
      },
    ],
    instructions: [
      {
        description:
          "Drain and rinse black beans. Add to a small saucepan over medium heat.",
      },
      {
        description:
          "Stir in cumin and chili powder. Cook for 5 minutes until heated through.",
      },
      {
        description:
          "Warm tortillas in a dry skillet or directly over a flame.",
      },
      {
        description:
          "Fill each tortilla with beans, cheese, and a squeeze of lime.",
      },
    ],
    notes: [{ description: "Add salsa, sour cream, or avocado to taste." }],
    prepTime: 5,
    cookTime: 10,
  },
  {
    name: "Simple Pancakes",
    description: "Classic fluffy pancakes made from pantry staples.",
    ingredients: [
      {
        name: "All Purpose Flour",
        ingredientsQuantity: 1.5,
        ingredientsMeasurements: "cup",
      },
      {
        name: "Whole Milk",
        ingredientsQuantity: 1.25,
        ingredientsMeasurements: "cup",
      },
      { name: "Eggs", ingredientsQuantity: 2, ingredientsMeasurements: "each" },
      {
        name: "Butter",
        ingredientsQuantity: 2,
        ingredientsMeasurements: "tablespoon",
      },
      {
        name: "Baking Powder",
        ingredientsQuantity: 2,
        ingredientsMeasurements: "teaspoon",
      },
      {
        name: "Sugar",
        ingredientsQuantity: 1,
        ingredientsMeasurements: "tablespoon",
      },
      {
        name: "Salt",
        ingredientsQuantity: 0.5,
        ingredientsMeasurements: "teaspoon",
      },
    ],
    instructions: [
      {
        description:
          "Whisk together flour, baking powder, sugar, and salt in a large bowl.",
      },
      {
        description: "In a separate bowl, whisk milk, eggs, and melted butter.",
      },
      {
        description:
          "Pour wet ingredients into dry and stir until just combined — do not overmix.",
      },
      {
        description:
          "Heat a non-stick skillet over medium heat and lightly grease with butter.",
      },
      {
        description:
          "Pour 1/4 cup batter per pancake. Cook until bubbles form, then flip and cook 1-2 more minutes.",
      },
    ],
    notes: [
      {
        description: "Lumpy batter is fine — overmixing makes pancakes tough.",
      },
      {
        description:
          "Keep finished pancakes warm in a 200°F oven while cooking the rest.",
      },
    ],
    prepTime: 10,
    cookTime: 15,
  },
];

const seedRecipes = async () => {
  await connectDB();
  await Recipe.deleteMany({});
  await Recipe.insertMany(recipes);
  console.log("Recipes seeded successfully!");
  process.exit(0);
};

seedRecipes().catch((err) => {
  console.error("Error seeding recipes:", err);
  process.exit(1);
});
