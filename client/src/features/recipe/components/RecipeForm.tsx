import { useState } from "react";
import {
  type Recipe,
  type RecipeIngredient,
  type RecipeNote,
} from "../../../types/recipe.type";
import ErrorBanner from "../../../components/ErrorBanner";
import FieldError from "../../../components/FieldError";

interface RecipeFormProps {
  selectedRecipe: Recipe | null;
  onSubmit: (
    data: Omit<Recipe, "_id" | "createdBy" | "updatedBy">,
  ) => Promise<void>;
  onCancel: () => void;
  // Server-side error from the most recent submit attempt — shown at the
  // top of the form, contextual to whichever Dialog/Sheet this renders in.
  error?: string | null;
}

const defaultValues: Omit<Recipe, "_id" | "createdBy" | "updatedBy"> = {
  name: "",
  description: "",
  ingredients: [
    { name: "", ingredientsQuantity: 1, ingredientsMeasurements: "each" },
  ],
  instructions: [{ description: "" }],
  notes: [],
  yield: 0,
  calories: 0,
  totalFat: 0,
  sodium: 0,
  totalCarbohydrates: 0,
  protein: 0,
  prepTime: 0,
  cookTime: 0,
};

const inputClass = (hasError: boolean) =>
  `flex-1 rounded-md shadow-sm sm:text-sm ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-blue-500"
  }`;

function RecipeForm({
  selectedRecipe,
  onSubmit,
  onCancel,
  error,
}: RecipeFormProps) {
  const [formData, setFormData] = useState<
    Omit<Recipe, "_id" | "createdBy" | "updatedBy">
  >(
    selectedRecipe
      ? {
          name: selectedRecipe.name,
          description: selectedRecipe.description,
          ingredients: selectedRecipe.ingredients,
          instructions: selectedRecipe.instructions,
          notes: selectedRecipe.notes,
          yield: selectedRecipe.yield,
          calories: selectedRecipe.calories,
          totalFat: selectedRecipe.totalFat,
          sodium: selectedRecipe.sodium,
          totalCarbohydrates: selectedRecipe.totalCarbohydrates,
          protein: selectedRecipe.protein,
          prepTime: selectedRecipe.prepTime,
          cookTime: selectedRecipe.cookTime,
        }
      : defaultValues,
  );

  // Required-field validation. "name" (recipe), each ingredient's "name",
  // and each instruction's "description" are the only freeform fields the
  // schema actually requires without a default — quantity/measurement
  // fields always have a pre-filled value via their input/select defaults.
  const [nameTouched, setNameTouched] = useState(false);
  const [touchedIngredients, setTouchedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [touchedInstructions, setTouchedInstructions] = useState<Set<number>>(
    new Set(),
  );
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameError =
    nameTouched && !formData.name.trim() ? "Recipe name is required." : null;

  // --- Scalar field handler ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  // --- Ingredient handlers ---
  const handleIngredientChange = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing,
      ),
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: "", ingredientsQuantity: 1, ingredientsMeasurements: "each" },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length <= 1) return; // at least one required
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // --- Instruction handlers ---
  const handleInstructionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((ins, i) =>
        i === index ? { ...ins, description: value } : ins,
      ),
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, { description: "" }],
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length <= 1) return; // at least one required
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  // --- Note handlers ---
  const handleNoteChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) =>
        i === index ? { ...note, description: value } : note,
      ),
    }));
  };

  const addNote = () => {
    setFormData((prev) => ({
      ...prev,
      notes: [...prev.notes, { description: "" }],
    }));
  };

  const removeNote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyIngredientIndexes = formData.ingredients
      .map((ing, i) => (!ing.name.trim() ? i : null))
      .filter((i): i is number => i !== null);
    const emptyInstructionIndexes = formData.instructions
      .map((ins, i) => (!ins.description.trim() ? i : null))
      .filter((i): i is number => i !== null);

    const hasErrors =
      !formData.name.trim() ||
      emptyIngredientIndexes.length > 0 ||
      emptyInstructionIndexes.length > 0;

    if (hasErrors) {
      setNameTouched(true);
      setTouchedIngredients(new Set(emptyIngredientIndexes));
      setTouchedInstructions(new Set(emptyInstructionIndexes));
      setValidationMessage("Please fill in the highlighted fields below.");
      return;
    }

    setValidationMessage(null);
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-6 overflow-y-auto max-h-[80vh] pr-2"
      onSubmit={handleSubmit}
    >
      {error && <ErrorBanner message={error} />}
      {validationMessage && <ErrorBanner message={validationMessage} />}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => setNameTouched(true)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 sm:text-sm ${
            nameError
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        />
        <FieldError message={nameError} />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* Prep / Cook Time */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="prepTime"
            className="block text-sm font-medium text-gray-700"
          >
            Prep Time (min)
          </label>
          <input
            type="number"
            id="prepTime"
            value={formData.prepTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="cookTime"
            className="block text-sm font-medium text-gray-700"
          >
            Cook Time (min)
          </label>
          <input
            type="number"
            id="cookTime"
            value={formData.cookTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients <span className="text-red-500">*</span>
        </label>
        {formData.ingredients.map((ing, index) => {
          const ingError =
            touchedIngredients.has(index) && !ing.name.trim()
              ? "Required"
              : null;
          return (
            <div key={index} className="mb-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  onBlur={() =>
                    setTouchedIngredients((prev) => new Set(prev).add(index))
                  }
                  className={inputClass(!!ingError)}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={ing.ingredientsQuantity}
                  onChange={(e) =>
                    handleIngredientChange(
                      index,
                      "ingredientsQuantity",
                      Number(e.target.value),
                    )
                  }
                  className="w-16 rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
                <select
                  value={ing.ingredientsMeasurements}
                  onChange={(e) =>
                    handleIngredientChange(
                      index,
                      "ingredientsMeasurements",
                      e.target.value,
                    )
                  }
                  className="rounded-md border-gray-300 shadow-sm sm:text-sm"
                >
                  <option value="each">Each</option>
                  <option value="cup">Cup</option>
                  <option value="tablespoon">Tablespoon</option>
                  <option value="teaspoon">Teaspoon</option>
                  <option value="pound">Pound</option>
                  <option value="ounce">Ounce</option>
                  <option value="gram">Gram</option>
                  <option value="kilogram">Kilogram</option>
                  <option value="liter">Liter</option>
                  <option value="piece">Piece</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length <= 1}
                  title={
                    formData.ingredients.length <= 1
                      ? "At least one ingredient is required"
                      : undefined
                  }
                  className={`text-sm px-2 ${
                    formData.ingredients.length <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-500 hover:text-red-700"
                  }`}
                >
                  ✕
                </button>
              </div>
              <FieldError message={ingError} />
            </div>
          );
        })}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-1 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions <span className="text-red-500">*</span>
        </label>
        {formData.instructions.map((ins, index) => {
          const insError =
            touchedInstructions.has(index) && !ins.description.trim()
              ? "Required"
              : null;
          return (
            <div key={index} className="mb-2">
              <div className="flex gap-2 items-start">
                <span className="text-sm text-gray-500 mt-2 w-5 shrink-0">
                  {index + 1}.
                </span>
                <textarea
                  value={ins.description}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  onBlur={() =>
                    setTouchedInstructions((prev) => new Set(prev).add(index))
                  }
                  rows={2}
                  className={inputClass(!!insError)}
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={formData.instructions.length <= 1}
                  title={
                    formData.instructions.length <= 1
                      ? "At least one step is required"
                      : undefined
                  }
                  className={`text-sm px-2 mt-1 ${
                    formData.instructions.length <= 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-red-500 hover:text-red-700"
                  }`}
                >
                  ✕
                </button>
              </div>
              <FieldError message={insError} />
            </div>
          );
        })}
        <button
          type="button"
          onClick={addInstruction}
          className="mt-1 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Step
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        {formData.notes.map((note: RecipeNote, index: number) => (
          <div key={index} className="flex gap-2 mb-2 items-start">
            <textarea
              value={note.description}
              onChange={(e) => handleNoteChange(index, e.target.value)}
              rows={2}
              className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
            <button
              type="button"
              onClick={() => removeNote(index)}
              className="text-red-500 hover:text-red-700 text-sm px-2 mt-1"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addNote}
          className="mt-1 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Note
        </button>
      </div>

      {/* Button Group */}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
