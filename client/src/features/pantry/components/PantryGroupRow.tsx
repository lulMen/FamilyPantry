import {
  type PantryGroup,
  type PantryItem as PantryItemType,
} from "../../../types/pantry.type";
import PantryItem from "./PantryItem";

interface PantryGroupRowProps {
  group: PantryGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectItem: (item: PantryItemType) => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function PantryGroupRow({
  group,
  isExpanded,
  onToggle,
  onSelectItem,
}: PantryGroupRowProps) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b bg-gray-50 hover:bg-gray-100 cursor-pointer font-medium"
      >
        <td className="px-4 py-2">
          <span className="flex items-center gap-2">
            <span className="text-gray-400 w-3 inline-block">
              {isExpanded ? "▾" : "▸"}
            </span>
            {group.name}
            <span className="text-xs font-normal text-gray-500 bg-gray-200 rounded px-1.5 py-0.5">
              {group.items.length} lots
            </span>
            {group.isLowStock && (
              <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
                Low Stock
              </span>
            )}
          </span>
        </td>
        <td className="px-4 py-2">{group.totalQuantity}</td>
        <td className="px-4 py-2">{group.measurement}</td>
        <td className="px-4 py-2">—</td>
        <td className="px-4 py-2">{formatDate(group.soonestExpiration)}</td>
        <td className="px-4 py-2">—</td>
        <td className="px-4 py-2">—</td>
        <td className="px-4 py-2">—</td>
      </tr>
      {isExpanded &&
        group.items.map((item) => (
          <PantryItem
            key={item._id}
            item={item}
            onSelect={onSelectItem}
            variant="subrow"
          />
        ))}
    </>
  );
}

export default PantryGroupRow;
