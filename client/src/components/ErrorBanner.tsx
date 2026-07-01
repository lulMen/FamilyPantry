interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-2 mb-4">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-red-400 hover:text-red-600 font-bold leading-none text-base"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
