interface PantryDashboardProps {
  itemCount: number;
  onAddClick: () => void;
}

function PantryDashboard({ itemCount, onAddClick }: PantryDashboardProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Pantry Dashboard</h2>
      <span className="text-gray-600 mr-4">Total Items: {itemCount}</span>
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
