import { useState } from "react";
import {
  type PantryItem as PantryItemType,
  type PantryRow,
} from "../../../types/pantry.type";
import PantryItem from "./PantryItem";
import PantryGroupRow from "./PantryGroupRow";

type SortKey = "name" | "quantity" | "acquiredDate" | "expirationDate";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface PantryListProps {
  rows: PantryRow[];
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
  rows,
  sortConfig,
  onSortChange,
  onSelectItem,
}: PantryListProps) {
  // Expand/collapse is pure UI state — it doesn't affect data, so it lives
  // here rather than in PantryManager. Keyed by group key (lowercased name).
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3">Pantry Items</h3>
      {rows.length === 0 ? (
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
            {rows.map((row) =>
              row.type === "single" ? (
                <PantryItem
                  key={row.item._id}
                  item={row.item}
                  onSelect={onSelectItem}
                />
              ) : (
                <PantryGroupRow
                  key={row.group.key}
                  group={row.group}
                  isExpanded={expandedGroups.has(row.group.key)}
                  onToggle={() => toggleGroup(row.group.key)}
                  onSelectItem={onSelectItem}
                />
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PantryList;
