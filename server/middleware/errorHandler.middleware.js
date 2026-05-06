const errorHandler = (err, req, res, next) => {
  // Set default status code and message if not provided
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred.";

  // Handle specific Mongoose errors
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format.";
  } else if (err.name === "DocumentNotFoundError") {
    statusCode = 404;
    message = "Resource not found.";
  } else {
    console.error("Error:", err);
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
