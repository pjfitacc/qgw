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
  baseURL: "https://secure.quantumgateway.com/cgi/tqgwdbe.php", // Replace with your actual base URL
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    'Accept': 'text/html',
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
 * Parses pipe-delimited HTML response into structured data
 */
function parsePipeDelimitedResponse(htmlResponse: string): string[] {
  if (!htmlResponse.includes('|')) {
    throw new Error('Invalid response format: No pipe delimiter found');
  }

  // Extract content between HTML tags if present (using ES6 compatible regex)
  const contentMatch = htmlResponse.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const rawContent = contentMatch ? contentMatch[1] : htmlResponse;

  // Clean up any remaining HTML tags and whitespace
  const cleanedContent = rawContent
    .replace(/<[^>]+>/g, '')
    .trim();

  return cleanedContent.split('|').map(item => item.trim());
}

/**
 * Posts data to the API and returns parsed pipe-delimited response
 * 
 * @param directAPI - The DirectAPI payload to send
 * @returns Promise containing the parsed response array
 * @throws {AxiosError} When the request fails
 * @throws {Error} When response parsing fails
 */
export async function postToServer(
  directAPI: DirectAPI
): Promise<string[]> {
  const httpClient = createHttpClient();
  const formData = toFormUrlEncoded(directAPI);

  try {
    const response: AxiosResponse<string> = await httpClient.post(
      '', // Adjust endpoint path as needed
      formData,
      { responseType: 'text' } // Ensure we get raw HTML response
    );

    return parsePipeDelimitedResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API request failed with status ${error.response?.status}:`, {
        url: error.config?.url,
        data: error.response?.data,
      });
      
      // Attempt to parse error response if it's also pipe-delimited
      if (error.response?.data && typeof error.response.data === 'string') {
        try {
          const errorData = parsePipeDelimitedResponse(error.response.data);
          throw new Error(`Payment processing failed: ${errorData.join(' - ')}`);
        } catch {
          throw new Error(`Payment processing failed: ${error.response.data}`);
        }
      }
      
      throw new Error(
        `Payment processing failed: ${error.message}`
      );
    }
    
    // Re-throw non-Axios errors
    throw error;
  }
}

// TODO: Transform Quantum Gateway Response into a TransactionResponse
