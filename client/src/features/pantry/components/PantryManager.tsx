import { useState, useEffect, useMemo } from "react";
import { type PantryItem, type PantryRow } from "../../../types/pantry.type";
import {
  getAllPantryItems,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
} from "../../../api/pantry.api";

import PantryDashboard from "./PantryDashboard";
import PantryList from "./PantryList";
import PantryDetail from "./PantryDetail";
import PantryForm from "./PantryForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

type SortKey = "name" | "quantity" | "acquiredDate" | "expirationDate";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

// Returns the chronologically earliest of a list of ISO date strings,
// ignoring any that are missing/empty. Returns undefined if none are valid.
const getSoonestDate = (dates: (string | undefined)[]): string | undefined => {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (valid.length === 0) return undefined;
  return valid.reduce((soonest, d) =>
    new Date(d).getTime() < new Date(soonest).getTime() ? d : soonest,
  );
};

function PantryManager() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    const fetchPantryItems = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPantryItems();
        setItems(data);
        setError(null);
      } catch {
        setError("Failed to fetch pantry items.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPantryItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  }, [items, filterText]);

  // Groups filtered items by case-insensitive name into PantryRows (single
  // lots stay as-is; 2+ lots of the same name collapse into a group row),
  // then sorts the combined row list according to sortConfig.
  const rows: PantryRow[] = useMemo(() => {
    const groupMap = new Map<string, PantryItem[]>();
    for (const item of filteredItems) {
      const key = item.name.trim().toLowerCase();
      const existing = groupMap.get(key);
      if (existing) existing.push(item);
      else groupMap.set(key, [item]);
    }

    const builtRows: PantryRow[] = [];
    for (const groupItems of groupMap.values()) {
      if (groupItems.length === 1) {
        builtRows.push({ type: "single", item: groupItems[0] });
        continue;
      }

      const totalQuantity = groupItems.reduce((sum, i) => sum + i.quantity, 0);
      const soonestExpiration = getSoonestDate(
        groupItems.map((i) => i.expirationDate),
      );
      const soonestAcquired = getSoonestDate(
        groupItems.map((i) => i.acquiredDate),
      );
      const isLowStock = groupItems.some(
        (i) => i.trackStock && totalQuantity < i.minStockLevel,
      );

      builtRows.push({
        type: "group",
        group: {
          key: groupItems[0].name.trim().toLowerCase(),
          name: groupItems[0].name,
          items: groupItems,
          totalQuantity,
          measurement: groupItems[0].measurement,
          soonestExpiration,
          soonestAcquired,
          isLowStock,
        },
      });
    }

    const getSortValue = (row: PantryRow): string | number => {
      if (sortConfig.key === "name") {
        return row.type === "single" ? row.item.name : row.group.name;
      }
      if (sortConfig.key === "quantity") {
        return row.type === "single"
          ? row.item.quantity
          : row.group.totalQuantity;
      }
      if (sortConfig.key === "acquiredDate") {
        return row.type === "single"
          ? (row.item.acquiredDate ?? "")
          : (row.group.soonestAcquired ?? "");
      }
      // expirationDate
      return row.type === "single"
        ? (row.item.expirationDate ?? "")
        : (row.group.soonestExpiration ?? "");
    };

    builtRows.sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
      });
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });

    return builtRows;
  }, [filteredItems, sortConfig]);

  const handleSortChange = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectItem = (item: PantryItem) => {
    setSelectedItem(item);
    setFormMode(null);
  };

  const handleAddItem = async (
    formData: Omit<PantryItem, "_id" | "createdBy" | "updatedBy">,
  ) => {
    const newItem = await createPantryItem(formData as Omit<PantryItem, "_id">);
    setItems((prevItems) => [...prevItems, newItem]);
    setFormMode(null);
  };

  const handleUpdateItem = async (
    formData: Partial<Omit<PantryItem, "_id">>,
  ) => {
    if (!selectedItem) return;
    const updatedItem = await updatePantryItem(selectedItem._id, formData);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item,
      ),
    );
    setSelectedItem(updatedItem);
    setFormMode(null);
  };

  const handleDeleteItem = async (_id: string) => {
    await deletePantryItem(_id);
    setItems((prevItems) => prevItems.filter((item) => item._id !== _id));
    setSelectedItem(null);
  };

  return (
    <div>
      <PantryDashboard
        itemCount={items.length}
        filterText={filterText}
        onFilterChange={setFilterText}
        onAddClick={() => {
          setSelectedItem(null);
          setFormMode("add");
        }}
      />

      {isLoading && <p>Loading pantry items...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <PantryList
        rows={rows}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        onSelectItem={handleSelectItem}
      />

      {selectedItem && (
        <PantryDetail
          item={selectedItem}
          formMode={formMode === "add" ? null : formMode}
          onEdit={() => setFormMode("edit")}
          onDelete={() => handleDeleteItem(selectedItem._id)}
          onClose={() => setSelectedItem(null)}
          onCancel={() => setFormMode(null)}
          onSubmit={(data) => handleUpdateItem(data)}
        />
      )}

      <Dialog
        open={formMode === "add"}
        onOpenChange={(isOpen) => !isOpen && setFormMode(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Pantry Item</DialogTitle>
            <DialogDescription>
              Fill in the details for the new pantry item.
            </DialogDescription>
          </DialogHeader>
          <PantryForm
            selectedItem={null}
            onSubmit={handleAddItem}
            onCancel={() => setFormMode(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PantryManager;
