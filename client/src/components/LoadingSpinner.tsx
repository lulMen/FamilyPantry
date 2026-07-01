interface LoadingSpinnerProps {
  label?: string;
}

function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
      <span className="h-4 w-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
      {label}
    </div>
  );
}

export default LoadingSpinner;
