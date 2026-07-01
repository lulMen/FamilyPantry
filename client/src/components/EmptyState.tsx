interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-10 text-gray-500 text-sm">{message}</div>
  );
}

export default EmptyState;
