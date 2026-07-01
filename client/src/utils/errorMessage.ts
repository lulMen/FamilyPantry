import { isAxiosError } from "axios";

// Pulls the actual backend error message (server always responds with
// { error: "..." } via errorHandler.middleware.js) when available,
// falling back to a generic message for network failures or unexpected shapes.
export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    return data?.error ?? fallback;
  }
  return fallback;
};
