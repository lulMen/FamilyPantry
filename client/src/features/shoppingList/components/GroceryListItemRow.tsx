import { useState } from "react";
import {
  type GroceryListItem,
  type GroceryListItemStatus,
} from "../../../types/groceryList.type";

interface GroceryListItemRowProps {
  item: GroceryListItem;
  onStatusChange: (_id: string, status: GroceryListItemStatus) => void;
  onEdit: (_id: string, itemName: string, quantityNeeded: number) => void;
  onDelete: (_id: string) => void;
}

const STATUS_OPTIONS: GroceryListItemStatus[] = [
  "Pending",
  "In Cart",
  "Purchased",
  "Out of Stock",
];

const STATUS_COLORS: Record<GroceryListItemStatus, string> = {
  Pending: "bg-gray-100 text-gray-700",
  "In Cart": "bg-blue-100 text-blue-700",
  Purchased: "bg-green-100 text-green-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

// Pending: greyed out (not yet acted on)
// Purchased: strikethrough (done)
// Out of Stock: italic red with a warning icon (needs attention)
const getItemNameStyle = (status: GroceryListItemStatus) => {
  if (status === "Purchased") return "line-through text-gray-400";
  if (status === "Pending") return "text-gray-400";
  if (status === "Out of Stock") return "italic text-red-600";
  return "";
};

function GroceryListItemRow({
  item,
  onStatusChange,
  onEdit,
  onDelete,
}: GroceryListItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [itemName, setItemName] = useState(item.itemName);
  const [quantityNeeded, setQuantityNeeded] = useState(item.quantityNeeded);

  const handleSave = () => {
    if (!itemName.trim()) return;
    onEdit(item._id, itemName, quantityNeeded);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setItemName(item.itemName);
    setQuantityNeeded(item.quantityNeeded);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="border-b bg-yellow-50">
        <td className="px-4 py-2">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full rounded border-gray-300 shadow-sm text-sm"
            autoFocus
          />
        </td>
        <td className="px-4 py-2">
          <input
            type="number"
            value={quantityNeeded}
            onChange={(e) => setQuantityNeeded(Number(e.target.value))}
            className="w-16 rounded border-gray-300 shadow-sm text-sm"
          />
          {item.measurement && (
            <span className="ml-1 text-sm text-gray-500">
              {item.measurement}
            </span>
          )}
        </td>
        <td className="px-4 py-2 text-sm text-gray-400">—</td>
        <td className="px-4 py-2 flex gap-2">
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className={`px-4 py-2 ${getItemNameStyle(item.status)}`}>
        {item.status === "Out of Stock" && "⚠ "}
        {item.itemName}
      </td>
      <td className={`px-4 py-2 ${getItemNameStyle(item.status)}`}>
        {item.quantityNeeded} {item.measurement ?? ""}
      </td>
      <td className="px-4 py-2">
        <select
          value={item.status}
          onChange={(e) =>
            onStatusChange(item._id, e.target.value as GroceryListItemStatus)
          }
          className={`rounded px-2 py-1 text-sm font-medium border-0 ${STATUS_COLORS[item.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default GroceryListItemRow;
