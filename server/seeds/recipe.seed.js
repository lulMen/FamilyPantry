const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db.config");
const Recipe = require("../models/Recipe.model");

// =============================================================================
// DEMO-ALIGNED RECIPE SEED
//
// IMPORTANT — NUTRITION DATA:
// insertMany bypasses the controller, so Edamam is never called and all
// nutrition fields default to 0. After running this script, run the
// companion file server/tests/seed-nutrition.http to PUT each recipe
// through the controller and populate Edamam values.
//
// Demo strategy for Requirement #5 (Nutritional Info):
//   • Existing seeded recipes show cached nutrition values (after http update)
//   • Create a NEW recipe live during demo → proves real-time computation
//   • Edit ingredient → update → nutrition changes → proves dynamic behavior
//   • Create second recipe with same ingredients at different quantities →
//     compare calorie totals → proves values are not static
// =============================================================================
const recipes = [
  // ── Cross-reference demo (Requirement #4) ────────────────────────────────
  // Pantry has Black Beans (6 total each) which covers the 2 cup requirement
  // (raw quantity comparison: 6 >= 2). All other ingredients are NOT in the
  // pantry, so the generated shopping list includes:
  //   Corn Tortillas, Cumin, Chili Powder, Lime, Shredded Cheese
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

  // ── General catalog entries ───────────────────────────────────────────────
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
          "Cook garlic 1-2 minutes, return chicken and spoon sauce over it.",
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
          "Pour 1/4 cup batter per pancake. Cook until bubbles form, flip and cook 1-2 more minutes.",
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
  console.log(`Recipes seeded: ${recipes.length} items`);
  console.log(
    "⚠  Nutrition fields are 0 — run server/tests/seed-nutrition.http to populate via Edamam.",
  );
  process.exit(0);
};

seedRecipes().catch((err) => {
  console.error("Error seeding recipes:", err);
  process.exit(1);
});
