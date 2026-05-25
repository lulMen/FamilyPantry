import { type PantryItem } from "../../../types/pantry.type";
import { useState } from "react";

interface PantryFormProps {
  selectedItem: PantryItem | null;
  onSubmit: (data: Omit<PantryItem, "_id" | "createdBy" | "updatedBy">) => void;
  onCancel: () => void;
}

// Helper function to format date for input fields
const formatDate = (dateStr: unknown) => {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  if (dateStr instanceof Date) return dateStr.toISOString().split("T")[0];
  if (typeof dateStr === "string") return dateStr.split("T")[0];
  return String(dateStr).split("T")[0];
};

const defaultValues: Omit<PantryItem, "_id" | "createdBy" | "updatedBy"> = {
  name: "",
  quantity: 0,
  measurement: "each",
  acquiredDate: new Date().toISOString().split("T")[0],
  expirationDate: new Date().toISOString().split("T")[0],
  storageType: "Dry",
  storageLocation: "",
  minStockLevel: 0,
  trackStock: false,
  cost: 0,
};

function PantryForm({ selectedItem, onSubmit, onCancel }: PantryFormProps) {
  // Initialize form data based on whether we're editing an existing item or adding a new one
  const initialValues: Omit<PantryItem, "_id" | "createdBy" | "updatedBy"> =
    selectedItem
      ? {
          ...selectedItem,
          acquiredDate: formatDate(selectedItem.acquiredDate),
          expirationDate: formatDate(selectedItem.expirationDate),
        }
      : defaultValues;

  // Use local state to manage form data
  const [formData, setFormData] =
    useState<Omit<PantryItem, "_id" | "createdBy" | "updatedBy">>(
      initialValues,
    );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement ? e.target.checked : false;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "quantity" || id === "cost" || id === "minStockLevel"
          ? Number(value)
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <div>
        {/* Name */}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />

        {/* Quantity */}
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />

        {/* Measurement */}
        <label
          htmlFor="measurement"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Measurement
        </label>
        <select
          id="measurement"
          value={formData.measurement}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="pound">Pound</option>
          <option value="gram">Gram</option>
          <option value="ounce">Ounce</option>
          <option value="cup">Cup</option>
          <option value="teaspoon">Teaspoon</option>
          <option value="tablespoon">Tablespoon</option>
          <option value="each">Each</option>
          <option value="kilogram">Kilogram</option>
          <option value="liter">Liter</option>
          <option value="piece">Piece</option>
        </select>

        {/* Acquired Date */}
        <label
          htmlFor="acquiredDate"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Acquired Date
        </label>
        <input
          type="date"
          id="acquiredDate"
          value={formData.acquiredDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />

        {/* Expiration Date */}
        <label
          htmlFor="expirationDate"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Expiration Date
        </label>
        <input
          type="date"
          id="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />

        {/* Storage Type */}
        <label
          htmlFor="storageType"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Storage Type
        </label>
        <select
          id="storageType"
          value={formData.storageType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="Canned">Canned</option>
          <option value="Fresh">Fresh</option>
          <option value="Frozen">Frozen</option>
          <option value="Dry">Dry</option>
          <option value="Refrigerated">Refrigerated</option>
        </select>

        {/* Storage Location */}
        <label
          htmlFor="storageLocation"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Storage Location
        </label>
        <input
          type="text"
          id="storageLocation"
          value={formData.storageLocation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />

        {/* Minimum Stock Level */}
        <label
          htmlFor="minStockLevel"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Minimum Stock Level
        </label>
        <input
          type="number"
          id="minStockLevel"
          value={formData.minStockLevel}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />

        {/* Track Stock */}
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            id="trackStock"
            checked={formData.trackStock}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 block text-sm text-gray-700">Track Stock</span>
        </label>

        {/* Cost */}
        <label
          htmlFor="cost"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Cost
        </label>
        <input
          type="number"
          id="cost"
          value={formData.cost}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      {/* Button Group */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default PantryForm;
