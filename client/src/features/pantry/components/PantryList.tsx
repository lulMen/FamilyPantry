import { type PantryItem as PantryItemType } from "../../../types/pantry.type";
import PantryItem from "./PantryItem";

interface PantryListProps {
  items: PantryItemType[];
  onSelectItem: (item: PantryItemType) => void;
}

function PantryList({ items, onSelectItem }: PantryListProps) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-3">Pantry Items</h3>
      {items.length === 0 ? (
        <p className="text-gray-600">No items in the pantry.</p>
      ) : (
        <table className="mb-4 w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Measurement</th>
              <th className="px-4 py-2">Acquired Date</th>
              <th className="px-4 py-2">Expiration Date</th>
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
