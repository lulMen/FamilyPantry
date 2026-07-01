import { useState } from "react";
import {
  type GroceryListItem,
  type GroceryListItemStatus,
} from "../../../types/groceryList.type";
import { type RecipeMeasurement } from "../../../types/recipe.type";
import GroceryListItemRow from "./GroceryListItemRow";
import EmptyState from "../../../components/EmptyState";
import FormError from "../../../components/FormError";
import { getErrorMessage } from "../../../utils/errorMessage";

interface GroceryListItemTableProps {
  items: GroceryListItem[];
  listId: string;
  onStatusChange: (_id: string, status: GroceryListItemStatus) => void;
  onEdit: (
    _id: string,
    itemName: string,
    quantityNeeded: number,
  ) => Promise<void>;
  onDelete: (_id: string) => void;
  onAddItem: (item: Omit<GroceryListItem, "_id">) => Promise<void>;
}

function GroceryListItemTable({
  items,
  listId,
  onStatusChange,
  onEdit,
  onDelete,
  onAddItem,
}: GroceryListItemTableProps) {
  const [itemName, setItemName] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState(1);
  const [measurement, setMeasurement] = useState<RecipeMeasurement>("each");
  const [nameTouched, setNameTouched] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const isNameInvalid = nameTouched && !itemName.trim();

  const handleAdd = async () => {
    setNameTouched(true);
    if (!itemName.trim()) return;

    setAddError(null);
    setIsAdding(true);
    try {
      await onAddItem({
        listId,
        itemName,
        quantityNeeded,
        measurement,
        status: "Pending",
      });
      setItemName("");
      setQuantityNeeded(1);
      setMeasurement("each");
      setNameTouched(false);
    } catch (err) {
      setAddError(getErrorMessage(err, "Failed to add item."));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4">
      {items.length === 0 ? (
        <EmptyState message="No items in this list." />
      ) : (
        <table className="w-full text-left text-sm mb-4">
          <thead className="border-b font-medium">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <GroceryListItemRow
                key={item._id}
                item={item}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Inline Add Item Form */}
      <div className="border-t pt-4">
        {addError && <FormError message={addError} />}
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onBlur={() => setNameTouched(true)}
              className={`w-full rounded-md shadow-sm text-sm ${
                isNameInvalid ? "border-red-400" : "border-gray-300"
              }`}
            />
            {isNameInvalid && (
              <p className="text-red-600 text-xs mt-1">
                Item name is required.
              </p>
            )}
          </div>
          <input
            type="number"
            value={quantityNeeded}
            onChange={(e) => setQuantityNeeded(Number(e.target.value))}
            className="w-16 rounded-md border-gray-300 shadow-sm text-sm"
          />
          <select
            value={measurement}
            onChange={(e) =>
              setMeasurement(e.target.value as RecipeMeasurement)
            }
            className="rounded-md border-gray-300 shadow-sm text-sm"
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
            onClick={handleAdd}
            disabled={isAdding}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:opacity-60"
          >
            {isAdding ? "Adding..." : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroceryListItemTable;
