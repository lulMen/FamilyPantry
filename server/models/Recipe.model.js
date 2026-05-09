const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        pantryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pantry",
          default: null,
        },
        name: {
          type: String,
          required: true,
        },
        ingredientsQuantity: {
          type: Number,
          required: true,
        },
        ingredientsMeasurements: {
          type: String,
          enum: [
            "pounds",
            "grams",
            "ounces",
            "cups",
            "teaspoons",
            "tablespoons",
            "each",
            "kilograms",
            "liters",
            "pieces",
          ],
          required: true,
        },
      },
    ],
    instructions: [
      {
        description: { type: String, required: true },
      },
    ],
    notes: [
      {
        description: { type: String },
      },
    ],
    yield: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    totalFat: {
      type: Number,
      default: 0,
    },
    sodium: {
      type: Number,
      default: 0,
    },
    totalCarbohydrates: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    prepTime: {
      type: Number,
      default: 0,
    },
    cookTime: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdated" },
  },
);

module.exports = mongoose.model("Recipe", recipeSchema);
