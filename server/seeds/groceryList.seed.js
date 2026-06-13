const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = require("../config/db.config");
const GroceryList = require("../models/GroceryList.model");
const GroceryListItem = require("../models/GroceryListItem.model");

const seedGroceryLists = async () => {
  await connectDB();

  await GroceryListItem.deleteMany({});
  await GroceryList.deleteMany({});

  const lists = await GroceryList.insertMany([
    { listName: "Weekly Groceries" },
    { listName: "Baking Run" },
  ]);

  const [weeklyList, bakingList] = lists;

  await GroceryListItem.insertMany([
    {
      listId: weeklyList._id,
      itemName: "Chicken Breast",
      quantityNeeded: 4,
      measurement: "pound",
      status: "Pending",
    },
    {
      listId: weeklyList._id,
      itemName: "Whole Milk",
      quantityNeeded: 2,
      measurement: "liter",
      status: "Pending",
    },
    {
      listId: weeklyList._id,
      itemName: "Eggs",
      quantityNeeded: 12,
      measurement: "each",
      status: "In Cart",
    },
    {
      listId: bakingList._id,
      itemName: "All Purpose Flour",
      quantityNeeded: 5,
      measurement: "pound",
      status: "Pending",
    },
    {
      listId: bakingList._id,
      itemName: "Sugar",
      quantityNeeded: 2,
      measurement: "pound",
      status: "Pending",
    },
    {
      listId: bakingList._id,
      itemName: "Butter",
      quantityNeeded: 1,
      measurement: "pound",
      status: "Purchased",
    },
  ]);

  console.log("Grocery lists seeded successfully!");
  process.exit(0);
};

seedGroceryLists().catch((err) => {
  console.error("Error seeding grocery lists:", err);
  process.exit(1);
});
