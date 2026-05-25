import { useState, useEffect } from "react";
import { type PantryItem } from "../../../types/pantry.type";
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

function PantryManager() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pantry items on component mount
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

  // Handler functions for selecting, adding, updating, and deleting pantry items
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
        onAddClick={() => {
          setSelectedItem(null);
          setFormMode("add");
        }}
      />

      {isLoading && <p>Loading pantry items...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <PantryList items={items} onSelectItem={handleSelectItem} />

      {selectedItem && (
        <PantryDetail
          item={selectedItem}
          formMode={formMode === "add" ? null : formMode}
          onEdit={() => setFormMode("edit")}
          onDelete={() => handleDeleteItem(selectedItem._id)}
          onClose={() => setSelectedItem(null)}
          onCancel={() => setFormMode(null)}
          onSubmit={(data) => {
            handleUpdateItem(data);
          }}
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
