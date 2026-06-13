import { type PantryItem as PantryItemType } from "../../../types/pantry.type";
import PantryItem from "./PantryItem";

type SortKey = "name" | "quantity" | "acquiredDate" | "expirationDate";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface PantryListProps {
  items: PantryItemType[];
  sortConfig: SortConfig;
  onSortChange: (key: SortKey) => void;
  onSelectItem: (item: PantryItemType) => void;
}

function SortHeader({
  label,
  sortKey,
  sortConfig,
  onSortChange,
}: {
  label: string;
  sortKey: SortKey;
  sortConfig: SortConfig;
  onSortChange: (key: SortKey) => void;
}) {
  const isActive = sortConfig.key === sortKey;
  const arrow = isActive
    ? sortConfig.direction === "asc"
      ? " ↑"
      : " ↓"
    : " ↕";
  return (
    <th
      className="px-4 py-2 cursor-pointer select-none hover:text-green-600 whitespace-nowrap"
      onClick={() => onSortChange(sortKey)}
    >
      {label}
      <span className="text-xs text-gray-400">{arrow}</span>
    </th>
  );
}

function PantryList({
  items,
  sortConfig,
  onSortChange,
  onSelectItem,
}: PantryListProps) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3">Pantry Items</h3>
      {items.length === 0 ? (
        <p className="text-gray-600">No items found.</p>
      ) : (
        <table className="mb-4 w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <SortHeader
                label="Name"
                sortKey="name"
                sortConfig={sortConfig}
                onSortChange={onSortChange}
              />
              <SortHeader
                label="Quantity"
                sortKey="quantity"
                sortConfig={sortConfig}
                onSortChange={onSortChange}
              />
              <th className="px-4 py-2">Measurement</th>
              <SortHeader
                label="Acquired Date"
                sortKey="acquiredDate"
                sortConfig={sortConfig}
                onSortChange={onSortChange}
              />
              <SortHeader
                label="Expiration Date"
                sortKey="expirationDate"
                sortConfig={sortConfig}
                onSortChange={onSortChange}
              />
              <th className="px-4 py-2">Storage Type</th>
              <th className="px-4 py-2">Storage Location</th>
              <th className="px-4 py-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <PantryItem key={item._id} item={item} onSelect={onSelectItem} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PantryList;
