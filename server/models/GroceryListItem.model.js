const mongoose = require("mongoose");

const groceryListItemSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroceryList",
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    pantryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pantry",
    },
    measurement: {
      type: String,
      enum: [
        "pound",
        "gram",
        "ounce",
        "cup",
        "teaspoon",
        "tablespoon",
        "each",
        "kilogram",
        "liter",
        "piece",
      ],
    },
    type: {
      type: String,
      enum: ["Canned", "Fresh", "Frozen", "Dry", "Refrigerated"],
    },
    quantityNeeded: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "In Cart", "Purchased", "Out of Stock"],
      default: "Pending",
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

module.exports = mongoose.model("GroceryListItem", groceryListItemSchema);
