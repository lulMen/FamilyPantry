require("dotenv").config();

const express = require("express");

require("./config/db")();
const inventoryRoutes = require("./routes/inventory");
const recipeRoutes = require("./routes/recipe");
const groceryListItemRoutes = require("./routes/groceryListItem");
const groceryListRoutes = require("./routes/groceryList");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/inventory", inventoryRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/grocery-list-item", groceryListItemRoutes);
app.use("/api/grocery-list", groceryListRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
