import { type GroceryList } from "../../../types/groceryList.type";

interface GroceryListSelectorProps {
  lists: GroceryList[];
  selectedList: GroceryList | null;
  onSelect: (list: GroceryList) => void;
  onNewList: () => void;
  onDeleteList: (list: GroceryList) => void;
}

function GroceryListSelector({
  lists,
  selectedList,
  onSelect,
  onNewList,
  onDeleteList,
}: GroceryListSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {lists.map((list) => (
        <div key={list._id} className="flex items-center gap-1">
          <button
            onClick={() => onSelect(list)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              selectedList?._id === list._id
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {list.listName}
          </button>
          <button
            onClick={() => onDeleteList(list)}
            className="text-red-400 hover:text-red-600 text-xs px-1"
            title="Delete list"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={onNewList}
        className="px-4 py-2 bg-white border border-dashed border-gray-400 text-gray-600 rounded text-sm hover:bg-gray-50"
      >
        + New List
      </button>
    </div>
  );
}

export default GroceryListSelector;
