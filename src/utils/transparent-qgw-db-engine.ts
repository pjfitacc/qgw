import axios, { AxiosError, AxiosResponse } from "axios";
import { DirectAPI } from "../transparent-qgw-database/api";

export function toggleYesOrNO(boolean?: boolean): "Y" | "N" | undefined {
  if (boolean === undefined) return undefined;
  return boolean ? "Y" : "N";
}

export function toggle1or2(boolean?: boolean): "1" | "2" | undefined {
  if (boolean === undefined) return undefined;
  return boolean ? "1" : "2";
}

/**
 * Expected response structure from the Quantum Gateway API
 */
interface QuantumGatewayResponse {
  quantumGatewayTransactionResponse: string[];
}

/**
 * Configuration options for the HTTP client
 */
interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * Default configuration for the Quantum Gateway API client
 */
const DEFAULT_CONFIG: HttpClientConfig = {
  baseURL: "https://api.quantumgateway.com/v1", // Replace with your actual base URL
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
};

/**
 * Creates a configured axios instance for Quantum Gateway API
 */
function createHttpClient(config: HttpClientConfig = DEFAULT_CONFIG) {
  const client = axios.create(config);

  // Add request interceptor for logging/metrics
  client.interceptors.request.use((request) => {
    console.debug(`Sending request to ${request.url}`);
    return request;
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.error("API request failed:", error.message);
      throw error;
    }
  );

  return client;
}

/**
 * Converts an object to x-www-form-urlencoded format
 */
function toFormUrlEncoded(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([key, value]) => {
      const encodedValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      return `${encodeURIComponent(key)}=${encodeURIComponent(encodedValue)}`;
    })
    .join("&");
}

/**
 * Posts data to the Quantum Gateway API and returns the transaction response
 *
 * @param directAPI - The DirectAPI payload to send
 * @returns Promise containing the transaction response array
 * @throws {AxiosError} When the request fails
 */
export async function postToServer(directAPI: DirectAPI): Promise<string[]> {
  const httpClient = createHttpClient();
  const formData = toFormUrlEncoded(directAPI);

  try {
    const response: AxiosResponse<QuantumGatewayResponse> =
      await httpClient.post(
        "/transactions", // Adjust endpoint path as needed
        formData
      );

    if (!response.data.quantumGatewayTransactionResponse) {
      throw new Error("Invalid response structure from server");
    }

    return response.data.quantumGatewayTransactionResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific HTTP errors
      console.error(
        `API request failed with status ${error.response?.status}:`,
        {
          url: error.config?.url,
          data: error.response?.data,
        }
      );

      throw new Error(
        `Payment processing failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }

    // Re-throw non-Axios errors
    throw error;
  }
}

// TODO: Transform Quantum Gateway Response into a TransactionResponse
