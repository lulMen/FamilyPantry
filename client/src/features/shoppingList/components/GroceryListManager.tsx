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
import { getErrorMessage } from "../../../utils/errorMessage";

import GroceryListSelector from "./GroceryListSelector";
import GroceryListItemTable from "./GroceryListItemTable";
import ErrorBanner from "../../../components/ErrorBanner";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";

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
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  // Page-level error — for the initial fetch and for actions triggered
  // directly from the main page (delete list/item, status toggle, inline
  // edit, inline add). None of those are blocked by a Dialog overlay, so
  // a banner here is actually visible.
  const [error, setError] = useState<string | null>(null);

  // Errors scoped to each Dialog — a Dialog's full-screen overlay hides the
  // page-level banner behind it, so failures from an action triggered
  // *inside* a Dialog need to render inside that same Dialog.
  const [newListError, setNewListError] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      try {
        const data = await getAllGroceryLists();
        setLists(data);
        if (data.length > 0) setSelectedList(data[0]);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load shopping lists."));
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
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load list items."));
      }
    };
    fetchItems();
  }, [selectedList]);

  const handleSelectList = (list: GroceryList) => {
    setSelectedList(list);
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      setNewListError("List name is required.");
      return;
    }
    setIsCreatingList(true);
    try {
      const list = await createGroceryList(newListName.trim());
      setLists((prev: GroceryList[]) => [...prev, list]);
      setSelectedList(list);
      setNewListName("");
      setShowNewListDialog(false);
      setNewListError(null);
    } catch (err) {
      setNewListError(getErrorMessage(err, "Failed to create shopping list."));
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleDeleteList = async (list: GroceryList) => {
    try {
      await deleteGroceryList(list._id);
      setLists((prev: GroceryList[]) => prev.filter((l) => l._id !== list._id));
      if (selectedList?._id === list._id) {
        const remaining = lists.filter((l) => l._id !== list._id);
        setSelectedList(remaining.length > 0 ? remaining[0] : null);
      }
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete shopping list."));
    }
  };

  const handleAddItem = async (item: Omit<GroceryListItem, "_id">) => {
    // No try/catch here — GroceryListItemTable already wraps this call in
    // its own try/catch to manage local loading/error state for the inline
    // add form, so the error needs to propagate up to it, not get caught here.
    const newItem = await createGroceryListItem(item);
    setItems((prev: GroceryListItem[]) => [...prev, newItem]);
  };

  const handleEditItem = async (
    _id: string,
    itemName: string,
    quantityNeeded: number,
  ) => {
    // No try/catch here — GroceryListItemRow already wraps this call in its
    // own try/catch to manage local isSaving/editError state for the inline
    // edit row, so the error needs to propagate up to it, not get caught here.
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
    try {
      const updated = await updateGroceryListItem(_id, { status });
      setItems((prev: GroceryListItem[]) =>
        prev.map((i) => (i._id === _id ? updated : i)),
      );
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update item status."));
    }
  };

  const handleDeleteItem = async (_id: string) => {
    try {
      await deleteGroceryListItem(_id);
      setItems((prev: GroceryListItem[]) => prev.filter((i) => i._id !== _id));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete item."));
    }
  };

  const purchasedUnlockedCount = items.filter(
    (i) => i.status === "Purchased" && !i.locked,
  ).length;

  // Not inside an effect — this is a click handler, so calling setItems
  // directly here after an await is completely normal and not flagged.
  const handleConfirmPurchase = async () => {
    if (!selectedList) return;
    setIsPurchasing(true);
    try {
      const result = await purchaseList(selectedList._id);
      setPurchaseMessage(result.message);
      setShowPurchaseDialog(false);
      setPurchaseError(null);

      const refreshedItems = await getItemsByListId(selectedList._id);
      setItems(refreshedItems);
    } catch (err) {
      // Keep the dialog open on failure so the error is visible where the
      // action was triggered, instead of closing it and hiding the error
      // behind the page banner the overlay was covering.
      setPurchaseError(getErrorMessage(err, "Failed to process purchase."));
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Shopping Lists</h2>
      </div>

      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      {isLoading && <LoadingSpinner label="Loading lists..." />}
      {purchaseMessage && (
        <p className="text-green-600 mb-2 text-sm">{purchaseMessage}</p>
      )}

      <GroceryListSelector
        lists={lists}
        selectedList={selectedList}
        onSelect={handleSelectList}
        onNewList={() => {
          setNewListError(null);
          setShowNewListDialog(true);
        }}
        onDeleteList={handleDeleteList}
      />

      {selectedList ? (
        <>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                setPurchaseError(null);
                setShowPurchaseDialog(true);
              }}
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
        <EmptyState message="No lists yet. Create one to get started." />
      )}

      {/* New List Dialog */}
      <Dialog
        open={showNewListDialog}
        onOpenChange={(open) => {
          setShowNewListDialog(open);
          if (!open) setNewListError(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Shopping List</DialogTitle>
            <DialogDescription>
              Enter a name for your new list.
            </DialogDescription>
          </DialogHeader>
          {newListError && (
            <ErrorBanner
              message={newListError}
              onDismiss={() => setNewListError(null)}
            />
          )}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              className="flex-1 rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-sm"
              autoFocus
              disabled={isCreatingList}
            />
            <button
              onClick={handleCreateList}
              disabled={isCreatingList}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:opacity-60"
            >
              {isCreatingList ? "Creating..." : "Create"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase Confirmation Dialog */}
      <Dialog
        open={showPurchaseDialog}
        onOpenChange={(open) => {
          setShowPurchaseDialog(open);
          if (!open) setPurchaseError(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              {purchasedUnlockedCount} item(s) marked Purchased will be added to
              your pantry. Once confirmed, these items can no longer be changed
              back from Purchased. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {purchaseError && (
            <ErrorBanner
              message={purchaseError}
              onDismiss={() => setPurchaseError(null)}
            />
          )}
          <DialogFooter className="mt-2 flex gap-2">
            <button
              onClick={() => setShowPurchaseDialog(false)}
              disabled={isPurchasing}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPurchase}
              disabled={isPurchasing}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-60"
            >
              {isPurchasing ? "Processing..." : "Confirm Purchase"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GroceryListManager;
