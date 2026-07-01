interface FormErrorProps {
  message: string;
}

// Same visual language as ErrorBanner but meant to live inside a specific
// Sheet, Dialog, or inline form — i.e. right next to the action that failed,
// rather than at the top of the page.
function FormError({ message }: FormErrorProps) {
  return (
    <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2 mb-3">
      {message}
    </p>
  );
}

export default FormError;
