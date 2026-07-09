const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db.config");
const Pantry = require("../models/Pantry.model");

// =============================================================================
// DEMO-ALIGNED PANTRY SEED
// Each item is annotated with which demo requirement it supports.
// =============================================================================
const pantryItems = [
  // ── Grouping demo (Stretch #5) ───────────────────────────────────────────
  // Two lots with the same name in different cases prove case-insensitive
  // grouping. The group row surfaces the soonest expiration (Oct 2026).
  // Black Beans also covers the ingredient in the Black Bean Tacos
  // cross-reference demo (Requirement #4): 4 + 2 = 6 each on hand vs
  // 2 cups required — raw quantity 6 >= 2 so it is excluded from the list.
  {
    name: "Black Beans",
    quantity: 4,
    measurement: "each",
    storageType: "Canned",
    storageLocation: "Pantry Cabinet",
    acquiredDate: new Date("2026-01-10"),
    expirationDate: new Date("2027-06-01"),
    cost: 3.2,
    trackStock: true,
    minStockLevel: 2,
  },
  {
    name: "black beans", // lowercase — proves case-insensitive grouping
    quantity: 2,
    measurement: "each",
    storageType: "Canned",
    storageLocation: "Pantry Cabinet",
    acquiredDate: new Date("2026-03-05"),
    expirationDate: new Date("2026-10-15"), // soonest → surfaces on group row
    cost: 2.8,
    trackStock: false,
  },

  // ── Filter demo (Requirement #2) ─────────────────────────────────────────
  // Typing "bean" returns the Black Beans group row AND this row — clear
  // partial match. Typing "Green Beans" exactly returns only this row.
  {
    name: "Green Beans",
    quantity: 3,
    measurement: "each",
    storageType: "Canned",
    storageLocation: "Pantry Cabinet",
    acquiredDate: new Date("2026-02-20"),
    expirationDate: new Date("2027-03-01"),
    cost: 1.99,
    trackStock: false,
  },

  // ── Recipe ingredients — Garlic Butter Chicken ───────────────────────────
  {
    name: "Chicken Breast",
    quantity: 3,
    measurement: "pound",
    storageType: "Frozen",
    storageLocation: "Chest Freezer",
    acquiredDate: new Date("2026-06-01"),
    expirationDate: new Date("2026-11-15"),
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
    acquiredDate: new Date("2026-04-01"),
    cost: 6.49,
    trackStock: false,
  },
  {
    name: "Butter",
    quantity: 2,
    measurement: "pound",
    storageType: "Refrigerated",
    storageLocation: "Fridge",
    acquiredDate: new Date("2026-06-15"),
    expirationDate: new Date("2026-09-01"),
    cost: 4.99,
    trackStock: false,
  },

  // ── Recipe ingredients — Simple Pancakes ─────────────────────────────────
  {
    name: "All Purpose Flour",
    quantity: 5,
    measurement: "pound",
    storageType: "Dry",
    storageLocation: "Pantry Cabinet",
    acquiredDate: new Date("2026-05-01"),
    cost: 2.99,
    trackStock: false,
  },
  {
    name: "Whole Milk",
    quantity: 2,
    measurement: "liter",
    storageType: "Refrigerated",
    storageLocation: "Fridge",
    acquiredDate: new Date("2026-07-01"),
    expirationDate: new Date("2026-07-25"),
    cost: 4.5,
    trackStock: true,
    minStockLevel: 1,
  },
  {
    name: "Sugar",
    quantity: 3,
    measurement: "pound",
    storageType: "Dry",
    storageLocation: "Pantry Cabinet",
    acquiredDate: new Date("2026-04-10"),
    cost: 2.49,
    trackStock: false,
  },

  // ── Low Stock Alert demo (Stretch #4) ────────────────────────────────────
  // quantity (4) < minStockLevel (12) → Low Stock badge shows immediately.
  // No extra steps needed during the demo — just navigate to Pantry page.
  {
    name: "Eggs",
    quantity: 4,
    measurement: "each",
    storageType: "Refrigerated",
    storageLocation: "Fridge",
    acquiredDate: new Date("2026-07-01"),
    expirationDate: new Date("2026-07-25"),
    cost: 3.99,
    trackStock: true,
    minStockLevel: 12,
  },
];

const seedPantry = async () => {
  await connectDB();
  await Pantry.deleteMany({});
  await Pantry.insertMany(pantryItems);
  console.log(`Pantry seeded: ${pantryItems.length} items`);
  process.exit(0);
};

seedPantry().catch((err) => {
  console.error("Error seeding pantry:", err);
  process.exit(1);
});
