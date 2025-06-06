import axios, { AxiosError, AxiosResponse } from "axios";
import { DirectAPI } from "../transparent-db/api";
import {
  TransactionDeclinedIssue,
  TransactionError,
} from "../errors/transaction-error";
import { TransactionResponse } from "../transparent-db/transaction/response";
import { TransparentDbEngine } from "../transparent-db";

export function toggleYesOrNO(boolean?: boolean): "Y" | "N" | undefined {
  if (boolean === undefined) return undefined;
  return boolean ? "Y" : "N";
}

export function toggle1or2(boolean?: boolean): "1" | "2" | undefined {
  if (boolean === undefined) return undefined;
  return boolean ? "1" : "2";
}

/**
 * Configuration options for the HTTP client
 *
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
  baseURL: TransparentDbEngine.postURL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "text/html",
  },
};

/**
 * Creates a configured axios instance for Quantum Gateway API
 */
function createHttpClient(config: HttpClientConfig = DEFAULT_CONFIG) {
  const client = axios.create(config);

  // Add request interceptor for logging/metrics
  client.interceptors.request.use((request) => {
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
 *
 * Handles the following response formats:
 * 1. Raw pipe-delimited: "value1"|"value2"|"value3"
 * 2. HTML-wrapped: <body>"value1"|"value2"</body>
 * 3. Mixed content: <html>..."value1"|"value2"...</html>
 *
 * For each item in the pipe-delimited string:
 * - Removes surrounding HTML tags if present
 * - Strips outer quotation marks from each value
 * - Trims whitespace from resulting values
 *
 * @param htmlResponse - The raw response string from the server
 * @returns Array of cleaned string values
 * @throws Error if no pipe delimiter is found in the response
 */
function parsePipeDelimitedResponse(htmlResponse: string): string[] {
  if (!htmlResponse.includes("|")) {
    throw new Error(
      "Invalid response format: No pipe delimiter found.\n" +
        "This qgw library only supports Transparent QuantumGateway's Default Pipe Delimiter for now." +
        'Please set your QuantumGateway Settings in your Quantum Gateway Account to: Settings => Processing Settings => Default Data Separator => select "Pipe" radio option => update\n' +
        "Also, when sending a transaction, make sure your DirectAPI type does not have Dsep value set, or if using the qgw library's TransactionRequest, do not set TransactionRequest.options.dataSeparator to have any value."
    );
  }

  // Extract content between HTML tags if present
  const contentMatch = htmlResponse.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const rawContent = contentMatch ? contentMatch[1] : htmlResponse;

  // Clean up any remaining HTML tags and whitespace
  const cleanedContent = rawContent.replace(/<[^>]+>/g, "").trim();

  return cleanedContent.split("|").map((item) => {
    // Remove surrounding quotes if they exist, then trim
    const unquoted = item.trim().replace(/^"(.*)"$/, "$1");
    return unquoted.trim();
  });
}

type RemoveUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

/**
 * Removes undefined properties from an object
 *
 * @param obj - The object to filter
 * @returns A new object with undefined properties removed
 */
function filterUndefined<T extends object>(obj: T): RemoveUndefined<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result as unknown as RemoveUndefined<T>;
}

/**
 * Posts data to the API and returns parsed pipe-delimited response
 *
 * @param directAPI - The DirectAPI payload to send
 * @returns Promise containing the parsed response array
 * @throws {@link AxiosError} When the request fails
 * @throws {@link Error} When response parsing fails
 * @throws {@link TransactionError} When the transaction is declined
 */
export async function postToServer(directAPI: DirectAPI): Promise<string[]> {
  const httpClient = createHttpClient();
  const filteredAPI = filterUndefined(directAPI);
  const formData = toFormUrlEncoded(filteredAPI);

  try {
    const response: AxiosResponse<string> = await httpClient.post(
      "", // Adjust endpoint path as needed
      formData,
      { responseType: "text" } // Ensure we get raw HTML response
    );

    catchQuantumGatewayErrors(response.data);

    return parsePipeDelimitedResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API request failed with status ${error.response?.status}:`,
        {
          url: error.config?.url,
          data: error.response?.data,
        }
      );

      // Attempt to parse error response if it's also pipe-delimited
      if (error.response?.data && typeof error.response.data === "string") {
        try {
          const errorData = parsePipeDelimitedResponse(error.response.data);
          throw new Error(
            `Payment processing failed: ${errorData.join(" - ")}`
          );
        } catch {
          throw new Error(`Payment processing failed: ${error.response.data}`);
        }
      }

      throw new Error(`Payment processing failed: ${error.message}`);
    }

    // Re-throw non-Axios errors
    throw error;
  }
}

/**
 * Handles errors from the Quantum Gateway API
 *
 * @param response - The raw response string from the server
 * @throws Generic Error if the response does not contain "APPROVED" or "DECLINED"
 * @throws TransactionError with code "ERR_SERVER_DECLINED": if the response contains "DECLINED"
 */
function catchQuantumGatewayErrors(response: string) {
  // If the response does not contain APPROVED or DECLINED, throw an error
  if (!response.includes("APPROVED") && !response.includes("DECLINED")) {
    throw new Error(
      "Quantum Gateway Server Error Response: " + response + "\n"
    );
  }

  if (response.includes("DECLINED")) {
    const declinedTransaction = new TransactionResponse(
      parsePipeDelimitedResponse(response)
    );

    const declinedIssue: TransactionDeclinedIssue = {
      message: declinedTransaction.declineReason ?? "Transaction Declined",
      code: declinedTransaction.errorCode ?? "Unknown Error",
      serverResponse: declinedTransaction,
    };

    throw new TransactionError({
      message: declinedTransaction.declineReason ?? "Transaction Declined",
      issues: [declinedIssue],
      code: "ERR_SERVER_DECLINED",
    });
  }
}
