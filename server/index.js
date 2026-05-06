require("dotenv").config();

const express = require("express");
const errorHandler = require("./middleware/errorHandler.middleware");

require("./config/db.config")();
const pantryRoutes = require("./routes/pantries.routes");
const recipeRoutes = require("./routes/recipes.routes");
const groceryListItemRoutes = require("./routes/groceryListItems.routes");
const groceryListRoutes = require("./routes/groceryLists.routes");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/pantries", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/grocery-list-items", groceryListItemRoutes);
app.use("/api/grocery-lists", groceryListRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
