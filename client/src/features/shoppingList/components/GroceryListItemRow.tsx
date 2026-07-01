import { useState } from "react";
import {
  type GroceryListItem,
  type GroceryListItemStatus,
} from "../../../types/groceryList.type";
import { getErrorMessage } from "../../../utils/errorMessage";

interface GroceryListItemRowProps {
  item: GroceryListItem;
  onStatusChange: (_id: string, status: GroceryListItemStatus) => void;
  onEdit: (
    _id: string,
    itemName: string,
    quantityNeeded: number,
  ) => Promise<void>;
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
  const [nameTouched, setNameTouched] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isNameInvalid = nameTouched && !itemName.trim();

  const handleSave = async () => {
    setNameTouched(true);
    if (!itemName.trim()) return;

    setEditError(null);
    setIsSaving(true);
    try {
      await onEdit(item._id, itemName, quantityNeeded);
      setIsEditing(false);
    } catch (err) {
      setEditError(getErrorMessage(err, "Failed to update item."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setItemName(item.itemName);
    setQuantityNeeded(item.quantityNeeded);
    setNameTouched(false);
    setEditError(null);
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
            onBlur={() => setNameTouched(true)}
            className={`w-full rounded shadow-sm text-sm ${
              isNameInvalid ? "border-red-400" : "border-gray-300"
            }`}
            autoFocus
          />
          {isNameInvalid && (
            <p className="text-red-600 text-xs mt-1">Item name is required.</p>
          )}
          {editError && (
            <p className="text-red-600 text-xs mt-1">{editError}</p>
          )}
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
            disabled={isSaving}
            className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
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
          disabled={item.locked}
          title={item.locked ? "Already purchased — locked" : undefined}
          onChange={(e) =>
            onStatusChange(item._id, e.target.value as GroceryListItemStatus)
          }
          className={`rounded px-2 py-1 text-sm font-medium border-0 ${STATUS_COLORS[item.status]} ${
            item.locked ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {item.locked && <span className="ml-2 text-xs text-gray-400">🔒</span>}
      </td>
      <td className="px-4 py-2 flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          disabled={item.locked}
          className={`text-sm ${item.locked ? "text-gray-300 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"}`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          disabled={item.locked}
          className={`text-sm ${item.locked ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-700"}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default GroceryListItemRow;
