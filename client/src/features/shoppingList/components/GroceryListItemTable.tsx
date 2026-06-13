import { useState } from "react";
import {
  type GroceryListItem,
  type GroceryListItemStatus,
} from "../../../types/groceryList.type";
import { type RecipeMeasurement } from "../../../types/recipe.type";
import GroceryListItemRow from "./GroceryListItemRow";

interface GroceryListItemTableProps {
  items: GroceryListItem[];
  listId: string;
  onStatusChange: (_id: string, status: GroceryListItemStatus) => void;
  onEdit: (_id: string, itemName: string, quantityNeeded: number) => void;
  onDelete: (_id: string) => void;
  onAddItem: (item: Omit<GroceryListItem, "_id">) => void;
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

  const handleAdd = () => {
    if (!itemName.trim()) return;
    onAddItem({
      listId,
      itemName,
      quantityNeeded,
      measurement,
      status: "Pending",
    });
    setItemName("");
    setQuantityNeeded(1);
    setMeasurement("each");
  };

  return (
    <div className="bg-white shadow rounded p-4">
      {items.length === 0 ? (
        <p className="text-gray-500 mb-4">No items in this list.</p>
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
      <div className="flex gap-2 items-center border-t pt-4">
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm text-sm"
        />
        <input
          type="number"
          value={quantityNeeded}
          onChange={(e) => setQuantityNeeded(Number(e.target.value))}
          className="w-16 rounded-md border-gray-300 shadow-sm text-sm"
        />
        <select
          value={measurement}
          onChange={(e) => setMeasurement(e.target.value as RecipeMeasurement)}
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
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default GroceryListItemTable;
