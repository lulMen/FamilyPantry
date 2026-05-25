import axios, { type AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Create an axios instance with the base URL and default headers
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure axios-retry to handle retries for network errors and server errors (5xx)
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or server errors (5xx)
    const isStandardRetryable =
      axiosRetry.isNetworkOrIdempotentRequestError(error);
    // Additionally, retry on server errors (5xx)
    const isServerError = !!(
      error.response &&
      error.response.status >= 500 &&
      error.response.status < 600
    );
    return isStandardRetryable || isServerError;
  },
});

export default apiClient;
