const mongoose = require("mongoose");

const pantrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    measurement: {
      type: String,
      enum: ["Pounds", "Grams", "Ounces", "Kilograms", "Liters", "Pieces"],
      required: true,
    },
    acquiredDate: {
      type: Date,
      default: Date.now,
    },
    expirationDate: {
      type: Date,
    },
    storageType: {
      type: String,
      enum: ["Canned", "Fresh", "Frozen", "Dry", "Refrigerated"],
      required: true,
    },
    storageLocation: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      min: 0,
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

module.exports = mongoose.model("Pantry", pantrySchema);
