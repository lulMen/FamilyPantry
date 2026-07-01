// Converts a camelCase or dot-path field name into a human-readable label.
// e.g. "ingredients.0.name" -> "Ingredient Name", "minStockLevel" -> "Min Stock Level"
const toFriendlyLabel = (field) => {
  const lastSegment = field.split(".").pop();
  return lastSegment
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred.";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "That item could not be found — it may have been deleted.";
  } else if (err.name === "DocumentNotFoundError") {
    statusCode = 404;
    message = "That item could not be found — it may have been deleted.";
  } else if (err.name === "ValidationError") {
    // Mongoose ValidationError.errors is a map of field path -> ValidatorError.
    // Translate it into a short, friendly sentence instead of the raw
    // "ValidationError: name: Path `name` is required." string.
    statusCode = 400;
    const fieldLabels = Object.keys(err.errors).map(toFriendlyLabel);
    const uniqueLabels = [...new Set(fieldLabels)];
    message =
      uniqueLabels.length === 1
        ? `${uniqueLabels[0]} is required.`
        : `Please fill in the following fields: ${uniqueLabels.join(", ")}.`;
  } else {
    console.error("Error:", err);
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
