interface FieldErrorProps {
  message?: string | null;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="text-red-600 text-xs mt-1">{message}</p>;
}

export default FieldError;
