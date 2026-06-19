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

// Helper function to safely format cost — cost is optional on the schema
const formatCost = (cost: unknown) => {
  if (cost === undefined || cost === null) return "—";
  return `$${(cost as number).toFixed(2)}`;
};

function PantryItem({ item, onSelect }: PantryItemProps) {
  const isLowStock = item.trackStock && item.quantity < item.minStockLevel;

  return (
    <tr
      onClick={() => onSelect(item)}
      className="border-b hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-4 py-2">
        <span className="flex items-center gap-2">
          {item.name}
          {isLowStock && (
            <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
              Low Stock
            </span>
          )}
        </span>
      </td>
      <td className="px-4 py-2">{item.quantity}</td>
      <td className="px-4 py-2">{item.measurement}</td>
      <td className="px-4 py-2">{formatDate(item.acquiredDate)}</td>
      <td className="px-4 py-2">{formatDate(item.expirationDate)}</td>
      <td className="px-4 py-2">{item.storageType}</td>
      <td className="px-4 py-2">{item.storageLocation}</td>
      <td className="px-4 py-2">{formatCost(item.cost)}</td>
    </tr>
  );
}

export default PantryItem;
