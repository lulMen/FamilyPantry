import { useState, useEffect } from "react";
import {
  type GroceryList,
  type GroceryListItem,
  type GroceryListItemStatus,
} from "../../../types/groceryList.type";
import {
  getAllGroceryLists,
  createGroceryList,
  deleteGroceryList,
  getItemsByListId,
  createGroceryListItem,
  updateGroceryListItem,
  deleteGroceryListItem,
} from "../../../api/groceryList.api";

import GroceryListSelector from "./GroceryListSelector";
import GroceryListItemTable from "./GroceryListItemTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";

function GroceryListManager() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null);
  const [items, setItems] = useState<GroceryListItem[]>([]);
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      try {
        const data = await getAllGroceryLists();
        setLists(data);
        if (data.length > 0) setSelectedList(data[0]);
        setError(null);
      } catch {
        setError("Failed to fetch shopping lists.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedList) {
        setItems([]);
        return;
      }
      try {
        const data = await getItemsByListId(selectedList._id);
        setItems(data);
      } catch {
        setError("Failed to fetch list items.");
      }
    };
    fetchItems();
  }, [selectedList]);

  const handleSelectList = (list: GroceryList) => {
    setSelectedList(list);
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    const list = await createGroceryList(newListName.trim());
    setLists((prev: GroceryList[]) => [...prev, list]);
    setSelectedList(list);
    setNewListName("");
    setShowNewListDialog(false);
  };

  const handleDeleteList = async (list: GroceryList) => {
    await deleteGroceryList(list._id);
    setLists((prev: GroceryList[]) => prev.filter((l) => l._id !== list._id));
    if (selectedList?._id === list._id) {
      const remaining = lists.filter((l) => l._id !== list._id);
      setSelectedList(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleAddItem = async (item: Omit<GroceryListItem, "_id">) => {
    const newItem = await createGroceryListItem(item);
    setItems((prev: GroceryListItem[]) => [...prev, newItem]);
  };

  const handleEditItem = async (
    _id: string,
    itemName: string,
    quantityNeeded: number,
  ) => {
    const updated = await updateGroceryListItem(_id, {
      itemName,
      quantityNeeded,
    });
    setItems((prev: GroceryListItem[]) =>
      prev.map((i) => (i._id === _id ? updated : i)),
    );
  };

  const handleStatusChange = async (
    _id: string,
    status: GroceryListItemStatus,
  ) => {
    const updated = await updateGroceryListItem(_id, { status });
    setItems((prev: GroceryListItem[]) =>
      prev.map((i) => (i._id === _id ? updated : i)),
    );
  };

  const handleDeleteItem = async (_id: string) => {
    await deleteGroceryListItem(_id);
    setItems((prev: GroceryListItem[]) => prev.filter((i) => i._id !== _id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Shopping Lists</h2>
      </div>

      {isLoading && <p>Loading lists...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <GroceryListSelector
        lists={lists}
        selectedList={selectedList}
        onSelect={handleSelectList}
        onNewList={() => setShowNewListDialog(true)}
        onDeleteList={handleDeleteList}
      />

      {selectedList ? (
        <GroceryListItemTable
          items={items}
          listId={selectedList._id}
          onStatusChange={handleStatusChange}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onAddItem={handleAddItem}
        />
      ) : (
        <p className="text-gray-500">
          No lists yet. Create one to get started.
        </p>
      )}

      <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Shopping List</DialogTitle>
            <DialogDescription>
              Enter a name for your new list.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              className="flex-1 rounded-md border-gray-300 shadow-sm text-sm"
              autoFocus
            />
            <button
              onClick={handleCreateList}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Create
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GroceryListManager;
