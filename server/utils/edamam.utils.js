const axios = require("axios");

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

const fetchNutritionData = async (ingredients) => {
  try {
    // Construct the query string for the Edamam API
    const ingrString = ingredients.map((item) => {
      return `${item.ingredientsQuantity} ${item.ingredientsMeasurements} ${item.name}`.trim();
    });

    const payload = {
      title: "Recipe Analysis",
      ingr: ingrString,
    };

    const url = `https://api.edamam.com/api/nutrition-details?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    return {
      yield: data.yield || 0,
      calories: data.calories || 0,
      totalFat: data.totalNutrients?.FAT?.quantity || 0,
      sodium: data.totalNutrients?.NA?.quantity || 0,
      totalCarbohydrates: data.totalNutrients?.CHOCDF?.quantity || 0,
      protein: data.totalNutrients?.PROCNT?.quantity || 0,
    };
  } catch (error) {
    console.error("Error fetching nutrition data:", error.message);
    return null;
  }
};

module.exports = {
  fetchNutritionData,
};
