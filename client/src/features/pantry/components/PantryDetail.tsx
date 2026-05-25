import { type PantryItem as PantryItemType } from "../../../types/pantry.type";
import PantryForm from "./PantryForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

interface PantryDetailProps {
  item: PantryItemType;
  formMode: "edit" | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (
    data: Omit<PantryItemType, "_id" | "createdBy" | "updatedBy">,
  ) => void;
}

function PantryDetail({
  item,
  formMode,
  onEdit,
  onDelete,
  onClose,
  onCancel,
  onSubmit,
}: PantryDetailProps) {
  return (
    <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:w-96">
        {formMode === "edit" ? (
          <PantryForm
            mode={formMode}
            selectedItem={item}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        ) : (
          <div>
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">
                {item.name || "Pantry Item"}
              </SheetTitle>
              <SheetDescription>
                {item?.storageType || "No description available."}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {/* Quantity */}
              <div className="flex justify-between">
                <span className="font-medium">Quantity:</span>
                <span>
                  {item.quantity} {item.measurement}
                </span>
              </div>
              {/* Storage Type */}
              <div className="flex justify-between">
                <span className="font-medium">Storage Type:</span>
                <span>{item.storageType}</span>
              </div>
              {/* Storage Location */}
              <div className="flex justify-between">
                <span className="font-medium">Storage Location:</span>
                <span>{item.storageLocation}</span>
              </div>
              {/* Minimum Stock Level */}
              <div className="flex justify-between">
                <span className="font-medium">Minimum Stock Level:</span>
                <span>{item.minStockLevel || 0}</span>
              </div>
              {/* Track Stock */}
              <div className="flex justify-between">
                <span className="font-medium">Track Stock:</span>
                <span>{item.trackStock ? "Yes" : "No"}</span>
              </div>
              {/* Cost */}
              <div className="flex justify-between">
                <span className="font-medium">Cost:</span>
                <span>
                  {item.cost != null ? `$${item.cost.toFixed(2)}` : "N/A"}
                </span>
              </div>
              {/* Acquired Date */}
              <div className="flex justify-between">
                <span className="font-medium">Acquired Date:</span>
                <span>
                  {item.acquiredDate
                    ? new Date(item.acquiredDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              {/* Expiration Date */}
              <div className="flex justify-between">
                <span className="font-medium">Expiration Date:</span>
                <span>
                  {item.expirationDate
                    ? new Date(item.expirationDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default PantryDetail;
