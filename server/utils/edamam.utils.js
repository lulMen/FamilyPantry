const axios = require("axios");

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

const fetchNutritionData = async (ingredients) => {
  try {
    const ingrString = ingredients.map((item) =>
      `${item.ingredientsQuantity} ${item.ingredientsMeasurements} ${item.name}`.trim(),
    );

    const payload = { title: "Recipe Analysis", ingr: ingrString };

    const url = `https://api.edamam.com/api/nutrition-details?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    // Edamam returns per-ingredient nutrition — aggregate across all parsed ingredients
    const totals = {
      calories: 0,
      totalFat: 0,
      sodium: 0,
      totalCarbohydrates: 0,
      protein: 0,
    };

    for (const ingredient of data.ingredients || []) {
      for (const parsed of ingredient.parsed || []) {
        const n = parsed.nutrients;
        totals.calories += n?.ENERC_KCAL?.quantity || 0;
        totals.totalFat += n?.FAT?.quantity || 0;
        totals.sodium += n?.NA?.quantity || 0;
        totals.totalCarbohydrates += n?.CHOCDF?.quantity || 0;
        totals.protein += n?.PROCNT?.quantity || 0;
      }
    }

    return {
      yield: data.yield || 0,
      calories: Math.round(totals.calories),
      totalFat: Math.round(totals.totalFat * 10) / 10,
      sodium: Math.round(totals.sodium * 10) / 10,
      totalCarbohydrates: Math.round(totals.totalCarbohydrates * 10) / 10,
      protein: Math.round(totals.protein * 10) / 10,
    };
  } catch (error) {
    console.error("Edamam error status:", error.response?.status);
    console.error("Edamam error data:", JSON.stringify(error.response?.data));
    console.error("Edamam error message:", error.message);
    return null;
  }
};

module.exports = { fetchNutritionData };
