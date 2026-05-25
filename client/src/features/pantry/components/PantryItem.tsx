import { type PantryItem as PantryItemType } from "../../../types/pantry.type";

interface PantryItemProps {
  item: PantryItemType;
  onSelect: (item: PantryItemType) => void;
}

// Helper function to format date for display
const formatDate = (dateStr: unknown) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr as string | Date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function PantryItem({ item, onSelect }: PantryItemProps) {
  return (
    <tr
      onClick={() => onSelect(item)}
      className="border-b hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-4 py-2">{item.name}</td>
      <td className="px-4 py-2">{item.quantity}</td>
      <td className="px-4 py-2">{item.measurement}</td>
      <td className="px-4 py-2">{formatDate(item.acquiredDate)}</td>
      <td className="px-4 py-2">{formatDate(item.expirationDate)}</td>
      <td className="px-4 py-2">{item.storageType}</td>
      <td className="px-4 py-2">{item.storageLocation}</td>
      <td className="px-4 py-2">${item.cost.toFixed(2)}</td>
    </tr>
  );
}

export default PantryItem;
