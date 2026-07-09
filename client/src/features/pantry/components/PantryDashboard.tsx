interface PantryDashboardProps {
  itemCount: number;
  filterText: string;
  onFilterChange: (value: string) => void;
  onAddClick: () => void;
}

function PantryDashboard({
  itemCount,
  filterText,
  onFilterChange,
  onAddClick,
}: PantryDashboardProps) {
  return (
    <div className="flex items-center gap-4 mb-4 flex-wrap">
      <h2 className="text-2xl font-bold">Pantry Dashboard</h2>
      <span className="text-gray-600">Total Items: {itemCount}</span>
      <input
        type="text"
        placeholder="Filter by name..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        className="flex-1 min-w-[200px] rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-sm"
      />
      <button
        onClick={onAddClick}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add Item
      </button>
    </div>
  );
}

export default PantryDashboard;
