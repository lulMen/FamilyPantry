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
  purchaseList,
} from "../../../api/groceryList.api";

import GroceryListSelector from "./GroceryListSelector";
import GroceryListItemTable from "./GroceryListItemTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";

function GroceryListManager() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null);
  const [items, setItems] = useState<GroceryListItem[]>([]);
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

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

  // Self-contained effect — keeps the async function fully inline so the
  // linter can verify no setState happens synchronously within the effect body.
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

  const purchasedUnlockedCount = items.filter(
    (i) => i.status === "Purchased" && !i.locked,
  ).length;

  // Not inside an effect — this is a click handler, so calling setItems
  // directly here after an await is completely normal and not flagged.
  const handleConfirmPurchase = async () => {
    if (!selectedList) return;
    const result = await purchaseList(selectedList._id);
    setPurchaseMessage(result.message);
    setShowPurchaseDialog(false);

    const refreshedItems = await getItemsByListId(selectedList._id);
    setItems(refreshedItems);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Shopping Lists</h2>
      </div>

      {isLoading && <p>Loading lists...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {purchaseMessage && (
        <p className="text-green-600 mb-2">{purchaseMessage}</p>
      )}

      <GroceryListSelector
        lists={lists}
        selectedList={selectedList}
        onSelect={handleSelectList}
        onNewList={() => setShowNewListDialog(true)}
        onDeleteList={handleDeleteList}
      />

      {selectedList ? (
        <>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowPurchaseDialog(true)}
              disabled={purchasedUnlockedCount === 0}
              className={`px-4 py-2 rounded text-sm font-medium ${
                purchasedUnlockedCount === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Purchase List
              {purchasedUnlockedCount > 0 ? ` (${purchasedUnlockedCount})` : ""}
            </button>
          </div>

          <GroceryListItemTable
            items={items}
            listId={selectedList._id}
            onStatusChange={handleStatusChange}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onAddItem={handleAddItem}
          />
        </>
      ) : (
        <p className="text-gray-500">
          No lists yet. Create one to get started.
        </p>
      )}

      {/* New List Dialog */}
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

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              {purchasedUnlockedCount} item(s) marked Purchased will be added to
              your pantry. Once confirmed, these items can no longer be changed
              back from Purchased. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex gap-2">
            <button
              onClick={() => setShowPurchaseDialog(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPurchase}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Confirm Purchase
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GroceryListManager;
