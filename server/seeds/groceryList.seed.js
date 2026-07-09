const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db.config");
const GroceryList = require("../models/GroceryList.model");
const GroceryListItem = require("../models/GroceryListItem.model");

// =============================================================================
// DEMO-ALIGNED GROCERY LIST SEED
//
// List 1 — "Weekly Groceries"
//   Shows all four status types and their visual indicators in one view:
//   Pending (greyed), In Cart (normal), Purchased (strikethrough),
//   Out of Stock (red italic + warning icon). Used for the status
//   indicator demo and the strikethrough stretch requirement.
//
// List 2 — "Pantry Restock"
//   Has unlocked Purchased items pre-staged for the Purchase List →
//   Pantry automation demo (Stretch #3). Trigger Purchase List on this
//   list to create new pantry entries with acquiredDate = now.
// =============================================================================
const seedGroceryLists = async () => {
  await connectDB();

  await GroceryListItem.deleteMany({});
  await GroceryList.deleteMany({});

  const lists = await GroceryList.insertMany([
    { listName: "Weekly Groceries" },
    { listName: "Pantry Restock" },
  ]);

  const [weeklyList, restockList] = lists;

  await GroceryListItem.insertMany([
    // ── Weekly Groceries — one item per status for the visual demo ──────────
    {
      listId: weeklyList._id,
      itemName: "Corn Tortillas",
      quantityNeeded: 8,
      measurement: "each",
      status: "Pending", // greyed out
    },
    {
      listId: weeklyList._id,
      itemName: "Shredded Cheese",
      quantityNeeded: 1,
      measurement: "cup",
      status: "In Cart", // normal text
    },
    {
      listId: weeklyList._id,
      itemName: "Lime",
      quantityNeeded: 3,
      measurement: "each",
      status: "Purchased", // strikethrough
    },
    {
      listId: weeklyList._id,
      itemName: "Cumin",
      quantityNeeded: 1,
      measurement: "teaspoon",
      status: "Out of Stock", // red italic + warning icon
    },

    // ── Pantry Restock — unlocked Purchased items for Purchase List demo ────
    // These are unlocked (locked defaults to false on new docs), so clicking
    // "Purchase List" will convert them to pantry entries with today's date.
    {
      listId: restockList._id,
      itemName: "Coffee Beans",
      quantityNeeded: 1,
      measurement: "pound",
      status: "Purchased",
    },
    {
      listId: restockList._id,
      itemName: "Orange Juice",
      quantityNeeded: 1,
      measurement: "liter",
      status: "Purchased",
    },
    {
      listId: restockList._id,
      itemName: "Greek Yogurt",
      quantityNeeded: 2,
      measurement: "each",
      status: "Pending", // not purchased — won't be converted
    },
  ]);

  console.log("Grocery lists seeded: 2 lists, 7 items");
  process.exit(0);
};

seedGroceryLists().catch((err) => {
  console.error("Error seeding grocery lists:", err);
  process.exit(1);
});
