const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db.config");
const Pantry = require("../models/Pantry.model");

const pantryItems = [
  {
    name: "Chicken Breast",
    quantity: 3,
    measurement: "pound",
    storageType: "Frozen",
    storageLocation: "Chest Freezer",
    expirationDate: new Date("2025-09-01"),
    cost: 8.99,
    trackStock: true,
    minStockLevel: 2,
  },
  {
    name: "Olive Oil",
    quantity: 1,
    measurement: "liter",
    storageType: "Dry",
    storageLocation: "Pantry Cabinet",
    cost: 6.49,
    trackStock: false,
  },
  {
    name: "Black Beans",
    quantity: 4,
    measurement: "each",
    storageType: "Canned",
    storageLocation: "Pantry Cabinet",
    expirationDate: new Date("2026-12-01"),
    cost: 3.2,
    trackStock: true,
    minStockLevel: 2,
  },
  {
    name: "Whole Milk",
    quantity: 1,
    measurement: "liter",
    storageType: "Refrigerated",
    storageLocation: "Fridge",
    expirationDate: new Date("2025-06-10"),
    cost: 4.5,
    trackStock: true,
    minStockLevel: 1,
  },
  {
    name: "All Purpose Flour",
    quantity: 2,
    measurement: "pound",
    storageType: "Dry",
    storageLocation: "Pantry Cabinet",
    cost: 2.99,
    trackStock: false,
  },
];

const seedPantry = async () => {
  await connectDB();
  await Pantry.deleteMany({});
  await Pantry.insertMany(pantryItems);
  console.log("Pantry seeded successfully!");
  process.exit(0);
};

seedPantry().catch((err) => {
  console.error("Error seeding pantry:", err);
  process.exit(1);
});
